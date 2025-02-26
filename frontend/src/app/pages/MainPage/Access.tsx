import { Authorized as AuthorizedComponent } from 'app/components';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import {
  PermissionLevels,
  ResourceTypes,
} from './pages/PermissionPage/constants';
import { selectIsOrgOwner, selectPermissionMap } from './slice/selectors';
import { UserPermissionMap } from './slice/types';

export interface AccessProps {
  type?: 'module' | 'privilege';
  module: ResourceTypes;
  id?: string;
  level: PermissionLevels;
  denied?: ReactElement | null;
  children?: ReactElement | null;
}

export function Access({
  type = 'privilege',
  module,
  id,
  level,
  denied = null,
  children,
}: AccessProps) {
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);
  if (!permissionMap[module]) {
    return null;
  }

  const isAuthorized = isOwner
    ? true
    : type === 'module'
    ? permissionMap[module]['*'] >= level
    : id
    ? permissionMap[module][id] >= level
    : false;

  return (
    <AuthorizedComponent authority={isAuthorized} denied={denied}>
      {children}
    </AuthorizedComponent>
  );
}

export interface AccessCascadeProps {
  module: ResourceTypes;
  path: string[];
  level: PermissionLevels;
  denied?: ReactElement | null;
  children?: ReactElement | null;
}

export function CascadeAccess({
  module,
  path,
  level,
  denied = null,
  children,
}: AccessCascadeProps) {
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);
  if (!permissionMap[module]) {
    return null;
  }
  const isAuthorized = getCascadeAccess(
    isOwner,
    permissionMap,
    module,
    path,
    level,
  );

  return (
    <AuthorizedComponent authority={isAuthorized} denied={denied}>
      {children}
    </AuthorizedComponent>
  );
}

export function useAccess({
  type = 'privilege',
  module,
  id,
  level,
}: AccessProps) {
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);

  return function <T>(obj: T) {
    if (!permissionMap[module]) {
      return void 0;
    }

    const allow = calcAc(isOwner, permissionMap, module, level, id, type);
    return allow ? obj : void 0;
  };
}

export function useCascadeAccess({ module, path, level }: AccessCascadeProps) {
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);

  return function <T>(obj: T) {
    if (!permissionMap[module]) {
      return void 0;
    }

    const allow = getCascadeAccess(isOwner, permissionMap, module, path, level);
    return allow ? obj : void 0;
  };
}

export function getCascadeAccess(
  isOwner: boolean,
  permissionMap: UserPermissionMap,
  module: ResourceTypes,
  path: string[],
  level: PermissionLevels,
) {
  // order: child -> parent
  const inversePath = path.slice().reverse();
  let allow = false;
  for (let i = 0; i < inversePath.length; i += 1) {
    const access = calcAc(
      isOwner,
      permissionMap,
      module,
      level,
      inversePath[i],
    );
    if (access !== void 0) {
      allow = access;
      break;
    }
  }
  return allow;
}

export function calcAc(
  isOwner: boolean,
  permissionMap: UserPermissionMap,
  module: ResourceTypes,
  level: PermissionLevels,
  id: string = '',
  type: 'module' | 'privilege' = 'privilege',
) {
  return isOwner
    ? true
    : type === 'module'
    ? permissionMap[module]['*'] >= level
    : id
    ? permissionMap[module][id] !== void 0
      ? permissionMap[module][id] >= level
      : void 0
    : false;
}
