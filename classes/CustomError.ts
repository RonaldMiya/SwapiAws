import { BaseError } from "./BaseError";

type ErrorProjects =
  | 'GET_PROJECT_ERROR'
  | 'CREATE_PROJECT_ERROR'
  | 'PROJECT_LIMIT_REACHED';

export class ProjectError extends BaseError<ErrorProjects> { }