export class FormError {
  errors: Array<Error>

  constructor(errors: Array<Error>) {
      this.errors = errors;
  }

  hasErrors(property: string = ""): boolean {
    if (property === "") {
      return this.errors.length > 0;
    }

    let hasErrors = false;
    this.errors.map(error => {
      if (error.property == property) {
        hasErrors = true;
      }
    });

    return hasErrors;
  }

  getErrors(property: string): Array<string> {
    let errors: Array<string> = [];
    this.errors.map(error => {
      if (error.property == property) {
        error.messages.map(message => {
          errors.push(message);
        });
      }
    });

    return errors;
  }
}

export interface Error {
  property: string;
  messages: Array<string>;
}