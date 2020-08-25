import { ValidationRule } from '../interfaces/validation';
import { FormError, Error } from '../classes/formError';

export class Validator {
    private emailPattern = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", "g");
    private errors: Array<Error> = [];
    private formData: any;
    private passwordValue = null;
    private passwordPropertyName = null;
  
    constructor(formData: any) {
      this.formData = formData;
    }
  
    validate(validationRules: Array<ValidationRule>) : FormError {
      validationRules.map(validation => {
        validation.rules.map(rule => {
          this.enforceValidationRules(validation.property, rule);
        });
      });
      return new FormError(this.errors);
    }
  
    private enforceValidationRules(property: string, rule: string) {
      switch (rule) {
        case "required":
          if (this.formData[property] == "") {
            this.errors[property] ? this.errors[property].messages.push(`${this.formatPropertyName(property)} is required`) :
              this.errors.push({ property: property, messages: [ `${this.formatPropertyName(property)} is required`] });
          }
          break;
        case "email":
          if (!this.emailPattern.test(this.formData[property])) {
            this.errors[property] ? this.errors[property].messages.push(`${this.formatPropertyName(property)} is an invalid email address`) :
              this.errors.push({ property: property, messages: [ `${this.formatPropertyName(property)} is an invalid email address`]});
          }
          break;
        case "password":
          if (this.passwordValue == null) {
            this.passwordValue = this.formData[property];
            this.passwordPropertyName = property;
          } else {
            if (this.passwordValue != this.formData[property]) {
              let message = "Passwords are not a match";
              this.errors[this.passwordPropertyName] ? this.errors[this.passwordPropertyName].messages.push(message) :
                this.errors.push({ property: this.passwordPropertyName, messages: [message] });
              this.errors[property] ? this.errors[property].messages.push(message) :
                this.errors.push({ property: property, messages: [message]})
            }
          }
          break;
        case "unique":
          break;
      }
    }

    private formatPropertyName(property: string) {
      let formattedString = `${property.substring(0, 1).toUpperCase()}${property.substring(1)}`;
      for (let i = 1; i < property.length; i++) {
        if (formattedString[i] == formattedString[i].toUpperCase()) {
          formattedString = `${formattedString.substring(0, i)} ${formattedString.substring(i)}`;
          i++;
        }
      }
      return formattedString;
    }
  }
  