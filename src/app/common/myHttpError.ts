import { HttpError } from "../store/app.reducers";

export class MyHttpError implements HttpError {
    error: any;
    errorEffect: string;
  
    constructor(error: any, errorEffect: string) {
      this.error = error;
      this.errorEffect = errorEffect;
    }
  }