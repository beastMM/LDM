//Variables globales
var velocidad = 80;
var tamaño = 10;

class objeto { //clase para metodo de deteccion de colisiones
	constructor(){
		this.tamaño = tamaño;
	}
	choque(obj){ //para detectar colisiones evaluar diferencia entre las posiciones x y
		var difx = Math.abs(this.x - obj.x); //math abs para calcular valor absoluto y que no de valor negativo
		var dify = Math.abs(this.y - obj.y);
		if(difx >= 0 && difx < tamaño && dify >= 0 && dify < tamaño){ //definir la diferencia minima de x y junto con el tamaño para que puedan pasar al lado y solo detecte al chocar
			return true;
		} else {
			return false;
		}
	}
}

class Cola extends objeto { //es una subclase la cual hereda elementos y variables
	constructor(x,y){ //almacenar valor x y,
		super(); //llamar al valor de la clase padre
		this.x = x;
		this.y = y;
		this.siguiente = null; //creamos variable siguiente
	}
	dibujar(ctx){ //dibujar cola serpiente con recursividad
		if(this.siguiente != null){ 
			this.siguiente.dibujar(ctx); //la funcion se llama asi misma
		}
		ctx.fillStyle = "#0000FF"; //color azul
		ctx.fillRect(this.x, this.y, this.tamaño, this.tamaño); //crear cuadro que forma la serpiente
	}
	setxy(x,y){
		if(this.siguiente != null){ //antes de dar posicion nueva la posicion anterior se almacena en el siguiente
			this.siguiente.setxy(this.x, this.y); //se crean cuadritos que siguen al cuadro principal definiendolos en la posicion anterior
		}
		this.x = x;
		this.y = y;
	}
	meter(){ //posicionar los cuadritos con la posicion definida arriba atras de la serpiente
		if(this.siguiente == null){
			this.siguiente = new Cola(this.x, this.y); 
		} else {
			this.siguiente.meter();
		}
	}
	verSiguiente(){
		return this.siguiente; //para utilizar luego en funcion choquecuerpo
	}
}

class Comida extends objeto { //crear comida en posicion aleatoria
	constructor(){
		super();
        this.x = this.generar(); //colocar this porque la funcion pertenece a la clase
		this.y = this.generar(); 
	}
	generar(){
		var num = (Math.floor(Math.random() * 59))*10; //generamos numeros aleatorios entre 0 y 590 de 10 en 10 con el math random (590 no incluido) y quitamos los decimales redondeadno con el mathfloor
		return num;
	}
	colocar(){ // le da la nueva posicion a la comida
		this.x = this.generar();
		this.y = this.generar();
	}
	dibujar(ctx){ //dibujamos la comida
		ctx.fillStyle = "#FF0000"; //color rojo
		ctx.fillRect(this.x, this.y, this.tamaño, this.tamaño);
	}
}
//Objetos del juego
//creamos variables
// no se puede retroceder en el juego para ello tenemos q subir y o bajar y cambiar de direccion, para esto creamos las siguientes variables (booleanas)
var cabeza = new Cola(20,20); //habilitar o bloquear ejes para no que no se pueda retroceder
var comida = new Comida(); 
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;
function movimiento(){ 
	var nx = cabeza.x+xdir; //nuevos valores a x y de la cabeza, obtenemos posicion y sumamos xy dir, variables de direccion de movimiento
	var ny = cabeza.y+ydir; 
	cabeza.setxy(nx,ny); //le damos las nuevas posiciones
}
function control(event){ //funcion con objeto event el cual permite acceder a la info de eventos desencadenados por teclas
	var cod = event.keyCode; //obtener propiedad del codigo de tecla la cual llamamos en el "body del html"
	if(ejex){ // si nos movemos en el eje x no podemos volver a movernos en ese eje por lo que solo escuchara las teclas del eje y (tambien evitamos que la culebra se mueva en diagonal)
		if(cod == 38){
			ydir = -tamaño;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
		if(cod == 40){
			ydir = tamaño;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
	}
	if(ejey){ 
		if(cod == 37){
			ydir = 0;
			xdir = -tamaño;
			ejey = false;
			ejex = true;
		}
		if(cod == 39){
			ydir = 0;
			xdir = tamaño;
			ejey = false;
			ejex = true;
		}
	}
}

function findeJuego(){ // finaliza el juego colocando todas las variables a su valor original
	xdir = 0;
	ydir = 0;
	ejex = true;
	ejey = true;
	cabeza = new Cola(20,20);
	comida = new Comida();
	alert("Perdiste"); //coloca ventana 
}
function choquepared(){ // si la cabeza toda cualquier punto de las paredes del canvas llama a la funcion findejuego
	if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590){
		findeJuego();
	}
}
function choquecuerpo(){
	var temp = null;
	try{    // trycatch es un if else con error (intenta ejecutar try y si no puede sigue con catch)
		temp = cabeza.verSiguiente().verSiguiente();
	}catch(err){
		temp = null;
	}
	while(temp != null){ //creamos un loop que verifica si la cabeza choca con el cuerpo
		if(cabeza.choque(temp)){ //si choca llamamos a la funcion findejuego
			//fin de juego
			findeJuego();
		} else {
			temp = temp.verSiguiente();
		}
	}
}

function dibujar(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d"); //definir el contexto grafico del canvas de arriba en este caso en 2d
	ctx.clearRect(0,0, canvas.width, canvas.height); //limpiar el area (function clear = cuadro de limpieza con alto ancho... todo lo que este detras se borrara,para dar ilusion de movimiento hay que limpiar y borrar)
	//aquí abajo va todo el dibujo
	cabeza.dibujar(ctx); //dibujamos cabeza
	comida.dibujar(ctx); //dibujamos comida
}
function main(){ //funcion de animacion donde se llaman a todas las funciones
	choquecuerpo(); //ejecutar choquecuerpo antes de dibujar o da error extraño
	choquepared();
	dibujar();
	movimiento();
	if(cabeza.choque(comida)){ 
		comida.colocar();
		cabeza.meter();
	}
}
setInterval("main()", velocidad); // bucle de 2 parametros (funcion, intervalo de tiempo en ms) va a llamar la funcion cada xms 