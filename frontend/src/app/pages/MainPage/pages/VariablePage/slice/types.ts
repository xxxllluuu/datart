import { SubjectTypes } from '../../PermissionPage/constants';
import { VariableTypes, VariableValueTypes } from '../constants';

export interface VariableState {
  variables: VariableViewModel[];
  variableListLoading: boolean;
  saveVariableLoading: boolean;
  deleteVariablesLoading: boolean;
}

export interface Variable {
  id: string;
  orgId: string;
  viewId?: string;
  name: string;
  label?: string;
  type: VariableTypes;
  valueType: VariableValueTypes;
  encrypt: boolean;
  permission: number;
  defaultValue?: string;
  expression?: boolean;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface VariableViewModel extends Variable {
  deleteLoading: boolean;
}

export interface AddVariableParams {
  variable: Omit<Variable, 'id'>;
  resolve: () => void;
}

export interface EditVariableParams {
  variable: Variable;
  resolve: () => void;
}

export interface DeleteVariableParams {
  ids: string[];
  resolve: () => void;
}

export interface RowPermissionSubject {
  id: string;
  name: string;
  email?: string;
  type: SubjectTypes;
  useDefaultValue: boolean;
  value?: any[];
}

export interface RowPermissionRaw {
  id: string;
  variableId: string;
  subjectId: string;
  subjectType: SubjectTypes;
  useDefaultValue: boolean;
  value?: string;
  permission?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}
export interface RowPermission extends Omit<RowPermissionRaw, 'value'> {
  value?: any[];
}
