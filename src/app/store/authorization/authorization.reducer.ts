import * as AuthorizationActions from './authorization.actions';
import { HttpError } from '../app.reducers';

export interface AuthorizationState {
  userRole: string[];
  userMode: boolean;
  authenticated: boolean;
  isActive: boolean;
  errors: Array<HttpError>;
  loading: boolean;
  provider?: string;
  isAdminRoute: boolean;
}

const initialState: AuthorizationState = {
  userRole: [],
  userMode: false,
  authenticated: false,
  isActive: false,
  errors: [],
  loading: false,
  isAdminRoute: false
};

export function authorizationReducer(
  state = initialState,
  action: AuthorizationActions.AuthActions
) {
  switch (action.type) {
    case AuthorizationActions.UPDATE_ADMIN_ROUTE:
      return {
        ...state,
        isAdminRoute: action.payload
      };
    case AuthorizationActions.UPDATE_USER_ROLE:
      return {
        ...state,
        userRole: action.payload.userRole,
      };
    case AuthorizationActions.SET_USER_MODE:
      return {
        ...state,
        userMode: action.payload,
      };
    case AuthorizationActions.SIGN_IN:
    case AuthorizationActions.SIGN_OUT:
    case AuthorizationActions.SIGN_UP:
      return {
        ...state,
        loading: true,
      };
    case AuthorizationActions.SIGN_UP_SUCCESS:
      return {
        ...state,
        errors: [
          ...state.errors.filter(
            (error) => error.errorEffect !== action.payload.effect
          ),
        ],
        loading: false,
      };

    case AuthorizationActions.SIGN_UP_FAILURE:
      return {
        ...state,
        authError: action.payload,
        loading: false
      };

      case AuthorizationActions.GOOGLE_SIGN_IN:
        return {
          ...state,
          loading: true,
          provider: action.payload.googleSignInRequest,
        };

    case AuthorizationActions.GOOGLE_SIGN_UP_FAILURE:
      return {
        ...state,
        authenticated: false,
        errors: [action.payload],
        loading: false,
      };
    case AuthorizationActions.SIGN_IN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        errors: [
          ...state.errors.filter(
            (error) => error.errorEffect !== action.payload.effect
          ),
        ],
        loading: false,
      };

      case AuthorizationActions.GOOGLE_SIGN_IN_SUCCESS:
        return {
          ...state,
          authenticated: true,
          errors: [
            ...state.errors.filter(
              (error) => error.errorEffect !== action.payload.token
            ),
          ],
          loading: false,
        };

    case AuthorizationActions.AUTH_ERROR:
      const errors = [...state.errors];
      const index = errors.findIndex(
        (error) => error.errorEffect === action.payload.errorEffect
      );
      if (index !== -1) {
        errors[index] = action.payload;
      } else {
        errors.push(action.payload);
      }
      return {
        ...state,
        loading: false,
        errors,
      };

    case AuthorizationActions.SIGN_OUT_SUCCESS:
      return initialState;

    case AuthorizationActions.FETCH_VERIFICATION_STATUS_SUCCESS:
      return {
        ...state,
        isActive: action.payload,
      };
    default:
      return state;
  }
}
