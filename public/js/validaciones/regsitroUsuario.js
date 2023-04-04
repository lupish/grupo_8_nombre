window.onload = function () {
    console.log("registroUsuario")
    form = document.getElementById("form");
    botonSubmit = document.getElementById("botonEnviar");

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        // obtener campos del formulario
        const form = document.getElementById('form'); 
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const contrasenia = document.getElementById('contrasenia');
        const confirmarContrasenia = document.getElementById('confirmar-contrasenia');
        const fotos = document.getElementById("user_foto");
        const contraseniaValida =  /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/
        console.log(fotos);
        errores = []
 
        if (nombre.value.length < 2) {
            setError(nombre, "El nombre debe tener al menos 2 caracteres")
        }else{
            console.log(nombre.value);
            setSuccess(nombre)
        }

        if (email.value === '') {
            setError(email, "Este campo es obligatorio")
        }else if(!isEmail(email.value)){
            setError(email, "Debe igresar un email válido(Ej: usuario@dominio.com)")
        }else{
            console.log(email.value);
            setSuccess(email)
        }

        if (contrasenia.value === '') {
            setError(contrasenia, "Este campo es obligatorio")
        }else if(contraseniaValida.test(contrasenia.value) == false){
            setError(contrasenia, "La contraseña debe tener al menos 8 caracteres, letras mayúsculas y minúsculas, un número y un símbolo")
        }else{
            console.log(contrasenia.value);
            setSuccess(contrasenia) 
        }

        if (confirmarContrasenia.value === '') {
            setError(confirmarContrasenia, "Debe confirmar la contraseña")
        }else if(contrasenia.value != confirmarContrasenia.value){
            setError(confirmarContrasenia, "Las contraseñas deben coincidir")
        }else{
            setSuccess(confirmarContrasenia) 
        }

        
        if (fotos != undefined) {
            const extensions = ['.jpg', '.png', '.gif', '.jpeg']
                if (
                    !(fotos.type.includes('jpg') || fotos.type.includes("jpeg")
                    || fotos.type.includes("gif") || fotos.type.includes("png"))
                ) {
                    setError(fotos, "La contraseña debe tener al menos 8 caracteres, letras mayúsculas y minúsculas, un número y un símbolo")
                }else{
                    setSuccess(fotos)
                }
            
        }

        function isEmail(email){
            return /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email);
        }
        function setError(input, message) {
            const formControl = input.parentElement;
            const small = formControl.querySelector('small');
            input.className = 'input-form-no-aceptado';
            small.innerText = message;
            errores.push(message)
        }
        function setSuccess(input) {
            input.classList.remove('input-form-no-aceptado')
            input.classList.add('input-form-aceptado')
        }


        if (errores.length === 0) {
            form.submit()
        }
        console.log(errores)
    }
)

}