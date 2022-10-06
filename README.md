# Propuestas de proyecto final
La propuesta de nuestro proyecto es el desarrollo de un videojuego con temática endless runner, el cual consiste en obtener la mayor cantidad de puntos en cada partida del juego, ya que a medida  que pasa el tiempo se complica el jugeo haciendo que al jugador se le sea difícil conseguir puntos y las posibilidades de perder y comenzar de nuevo la partida van aumentando

## Tematica
El contexto de nuestro videojuego será el espacio, ya que el personaje principal de nuestro juego será una nave espacial y los enemigos o objetivos de nuestro personajes serán asteroides. Similar al juego Starfox (NES)

## Dinámica del juego

El jugador contará con su personaje principal, que es la nave. Con ella tendrá que conseguir puntos destruyendo los asteroides que se van aproximando.El juego comienza con una velocidad lenta y con pocos asteroides para que el jugador pueda familiarizarse con el juego y así mismo practicar, pero en cuenta el juego vaya avanzando la velocidad aumentará al igual que los asteroides en la pantalla.
 El objetivo principal del juego es conseguir la mayor puntuación en el juego, para posteriormente poder batir su propio récord  o el de otros jugadores.

## Requerimientos Funcionales:
1. Creación de una nave espacial a través de la creación de un grupo de polígonos triangulares.
2. Generación de asteroides usando un algoritmo de randomización en dos planos.
3. La nave podrá disparar para poder destruir los asteroides, esto con la ayuda del movimiento del mouse o teclado.
4. La nave se podrá mover en todas las direcciones en un rango establecido, dependiendo de la resolución de nuestro canvas.
5. El jugador tiene que evitar que dos meteoritos sobrepasen el límite de la pantalla, de lo contrario perderá.
6. Se le darán puntos por cada meteorito que destruya al dispararle. 
7. La velocidad irá aumentando a medida que el jugador avance en el juego, esto basándose en el desempeño del jugador y el tiempo transcurrido.
8. Se le indicará al jugador cuando inicie el juego, a través de un pequeño menú interactivo.
9. Se le indicará al jugador cuando pierda el juego,a través de un método que genere una pausa.
10. Tendrá la opción de jugar de nuevo o salir. 
11. El juego tendrá una interfaz que le indique su puntuacion


Para la mayor parte de los puntos mencionados anteriormente, se podrán resolver con los conocimientos vistos y que se verán a un futuro en la materia, e igualmente con guías y ejemplos dados por el profesor. Por el otro lado, requerimientos más específicos como lo es guardar el score más alto, entre otros se encontrará la forma con asesoría del profesor y de foros de informática que nos da una idea de cómo realizar esa función en específico.

En cuanto las librerías, por ahora solo tenemos previsto usar la librería de Keyframe, que nos ayudará en todo lo enfocado en animaciones, definiendo frames en específico para poder realizar las animaciones del juego, y el más importante, Three.js, que es el que nos dará todas las herramientas para poder realizar, modificar, y manipular todos los objetos creados en nuestro espacio en tercera dimensión, para poder así, realizar todo lo que es el videojuego que tenemos pensando en realizar.
