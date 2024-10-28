const Cuadruplos = () => {
    const expresion = document.getElementById('expression').value.trim();
    const resultadoContenedor = document.getElementById('result');
    resultadoContenedor.innerHTML = ''; 

    const validacion = /^[a-zA-Z0-9+\-*/() ]+$/;
    if (!expresion || !validacion.test(expresion)) {
        resultadoContenedor.innerHTML = 'Por favor, ingresa una expresión válida (números, letras, operadores +, -, *, / y paréntesis).';
        return;
    }

    let cuadruplo = [];
    let contadorTemporal = 1;

    const precedenciaOperadores = { '+': 1, '-': 1, '*': 2, '/': 2 };
    let pilaOperadores = [];
    let salidaOperandos = [];

    const aplicarOperacion = () => {
        const operador = pilaOperadores.pop();
        const operando2 = salidaOperandos.pop();
        const operando1 = salidaOperandos.pop();
        const resultadoTemporal = `T${contadorTemporal++}`;
        
        const resultado = eval(`${operando1} ${operador} ${operando2}`);

        cuadruplo.push({ operador, operando1, operando2, resultado: resultadoTemporal, valor: resultado });
        salidaOperandos.push(resultado); 
    };

    const partesExpresion = expresion.match(/([a-zA-Z]+|\d+|[+\-*/()])/g);

    partesExpresion.forEach(parte => {
        if (!isNaN(parte) || /^[a-zA-Z]+$/.test(parte)) {
            salidaOperandos.push(parte);
        } else if (parte === '(') {
            pilaOperadores.push(parte);
        } else if (parte === ')') {
            while (pilaOperadores.length && pilaOperadores[pilaOperadores.length - 1] !== '(') {
                aplicarOperacion();
            }
            pilaOperadores.pop(); 
        } else if (['+', '-', '*', '/'].includes(parte)) {
            while (
                pilaOperadores.length &&
                pilaOperadores[pilaOperadores.length - 1] !== '(' &&
                precedenciaOperadores[pilaOperadores[pilaOperadores.length - 1]] >= precedenciaOperadores[parte]
            ) {
                aplicarOperacion();
            }
            pilaOperadores.push(parte);
        }
    });

    while (pilaOperadores.length) {
        aplicarOperacion();
    }

    cuadruplo.forEach((cuadruplo, indice) => {
        const elementoCuadruplo = document.createElement('div');
        elementoCuadruplo.className = 'quadruple';
        elementoCuadruplo.innerHTML = `(${indice + 1}) ${cuadruplo.operando1} ${cuadruplo.operador} ${cuadruplo.operando2} = ${cuadruplo.valor}`;
        resultadoContenedor.appendChild(elementoCuadruplo);
    });

    if (cuadruplo.length > 0) {
        const resultadoFinal = salidaOperandos.pop(); 
        const elementoResultadoFinal = document.createElement('div');
        elementoResultadoFinal.className = 'quadruple final-result';
        elementoResultadoFinal.innerHTML = `<strong>Resultado Final: ${resultadoFinal}</strong>`;
        resultadoContenedor.appendChild(elementoResultadoFinal);
    }
};

document.querySelector('button').addEventListener('click', Cuadruplos);
