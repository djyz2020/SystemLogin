var Session = function(){

  this.element = {
    form:   null,
    submit: null
  }

  // check if all fields in form validate
  this.allFieldsValidate = () => {
    return Array.from(this.element.fields).every(function(field){
      return field.validity.valid === true
    })
  }

  // disable submit on validating form
  this.disableSubmit = () => {
    if (this.allFieldsValidate()){
      this.element.submit.disabled = true
    }
  }

  this.init = () => {
    this.element.form   = document.querySelector("#session-form")
    this.element.submit = this.element.form.querySelector(".formActions input")
    this.element.fields = this.element.form.querySelectorAll("fieldset input")

    // double check if validation should be run
    if (this.element.form){
      this.element.form.addEventListener("submit", this.disableSubmit)
    }
  }
}

window.SessionManager = new Session()
window.SessionManager.init()