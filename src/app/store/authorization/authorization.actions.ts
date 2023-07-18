import { Action } from '@ngrx/store';
import { HttpError } from '../app.reducers';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { GoogleSignInRequest } from '../model';

export const UPDATE_ADMIN_ROUTE = 'UPDATE_ADMIN_ROUTE';
export const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE';
export const SET_USER_MODE = 'SET_USER_MODE';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
export const GOOGLE_SIGN_UP = 'GOOGLE_SIGN_UP';
export const GOOGLE_SIGN_UP_SUCCESS = 'GOOGLE_SIGN_UP_SUCCESS';
export const GOOGLE_SIGN_UP_FAILURE = 'GOOGLE_SIGN_UP_FAILURE';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
export const GOOGLE_SIGN_IN = 'GOOGLE_SIGN_IN';
export const GOOGLE_SIGN_IN_SUCCESS = 'GOOGLE_SIGN_IN_SUCCESS';
export const GOOGLE_SIGN_IN_FAILURE = 'GOOGLE_SIGN_IN_FAILURE';
export const CHECK_IF_LOGGED_IN = 'CHECK_IF_LOGGED_IN';
export const FETCH_VERIFICATION_STATUS = 'FETCH_VERIFICATION_STATUS';
export const FETCH_VERIFICATION_STATUS_SUCCESS = 'FETCH_VERIFICATION_STATUS_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';

export class UpdateAdminRoute implements Action {
  readonly type = UPDATE_ADMIN_ROUTE;

  constructor(public payload: boolean) {}
}

export class SetUserMode implements Action {
  readonly type = SET_USER_MODE;
  constructor(public payload: boolean) {}
}

export class UpdateUserRole implements Action {
  readonly type = UPDATE_USER_ROLE;
  constructor(public payload: { userRole: string[] }) {}
}
export class SignUp implements Action {
  readonly type = SIGN_UP;

  constructor(public payload: { email: string, password: string, passwordRepeat: string }) {
  }
}

export class SignUpSuccess implements Action {
  readonly type = SIGN_UP_SUCCESS;

  constructor(public payload: { effect: string }) {
  }
}

export class SignUpFailure implements Action {
  readonly type = SIGN_UP_FAILURE;

  constructor(public payload: HttpError) {}
}

export class GoogleSignUpSuccess implements Action {
  readonly type = GOOGLE_SIGN_UP_SUCCESS;
  constructor(public payload: { effect: string }) {}
}

export class GoogleSignUpFailure implements Action {
  readonly type = GOOGLE_SIGN_UP_FAILURE;

  constructor(public payload: HttpError) {}
}

export class SignIn implements Action {
  readonly type = SIGN_IN;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class SignInSuccess implements Action {
  readonly type = SIGN_IN_SUCCESS;
  constructor(public payload: { effect: string }) {
  }
}

export class SignOut implements Action {
  readonly type = SIGN_OUT;
}

export class SignOutSuccess implements Action {
  readonly type = SIGN_OUT_SUCCESS;
}

export class CheckIfLoggedIn implements Action {
  readonly type = CHECK_IF_LOGGED_IN;
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;

  constructor(public payload: HttpError) {
  }
}

export class FetchVerificationStatus implements Action {
  readonly type = FETCH_VERIFICATION_STATUS;
}

export class FetchVerificationStatusSuccess implements Action {
  readonly type = FETCH_VERIFICATION_STATUS_SUCCESS;

  constructor(public payload: boolean) {
  }
}

export class GoogleSignIn implements Action {
  readonly type = GOOGLE_SIGN_IN;

  constructor(public payload: {
    googleSignInRequest: GoogleSignInRequest
  }) {}
}

export class GoogleSignInSuccess implements Action {
  readonly type = GOOGLE_SIGN_IN_SUCCESS;
  constructor(public payload: { token: string }) {}
}

export class GoogleSignInFailure implements Action {
  readonly type = GOOGLE_SIGN_IN_FAILURE;
  constructor(public payload: HttpError) {}
}

export type AuthActions = UpdateAdminRoute | UpdateUserRole | SetUserMode | SignUp | SignUpSuccess | SignUpFailure | GoogleSignUpSuccess | GoogleSignUpFailure | SignIn | SignInSuccess
  | SignOut | SignOutSuccess | CheckIfLoggedIn
  | FetchVerificationStatus | FetchVerificationStatusSuccess | GoogleSignInSuccess | GoogleSignInFailure | GoogleSignIn
  | AuthError;
