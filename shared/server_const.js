module.exports = Object.freeze( {
	CONNECT: 'connect',
	DISCONNECT: 'disconnect',
	CONECTADO: 'conectado',
	LOGIN_TOKEN: 'login-token',
	LOGIN: 'login',
	TOKEN: 'token',
	PARTIDAS: 'partidas',
	PING: 'ping',
	NUEVA_PARTIDA: 'nueva-partida',
	NUEVO_JUGADOR: 'nuevo-jugador',
	NUEVO_USUARIO: 'nuevo-usuario',
	PARTIDAS_NUEVAS: 'partidas-nuevas',
	JOIN_ROOM: "join-room",
	EMPEZAR_PARTIDA: "empezar-partida",
	CARGAR_PARTIDA: "cargar-partida",
	ACTUALIZAR_JUGADOR: "actualizar-jugador",
	ACCION_JUGADOR: "accion-jugador",
	GOLPE_INICIADO: "golpe_iniciado",
	ACCION_PREVIA: "accion_previa",
	
	ESTADOS_JUEGO: {
		INICIO: "INICIO",
		GOLPE_INICIADO: 'GOLPE_INICIADO',
		ACCIONES: "ACCIONES"
	},
	
	ESTADO_JUGADOR: {
		ESPERANDO: 'WAITING',
		GOLPE: 'STROKE',
		ACCION: 'YOUR TURN',
		ACCION_PREVIA: 'PREVIOUS ACTION',
		TURNO: 'WAITING TURN', //ESPERANDO TURNO
		GREEN: 'GREEN',
		ENTRANDO_GREEN: 'TO GREEN',
		FIN_HOYO: 'HOLE IN',
		FIN_ACCIONES: 'NO DICE LEFT'
	},
	
	ESTADO_PARTIDA: {
		ESPERANDO: 'E',
		GOLPE: 'G',
		ACCION: 'A',
		TURNO: 'T', //ESPERANDO TURNO
		ACCION_PREVIA: 'R',
		GREEN: 'N',
		ENTRANDO_GREEN: 'Y',
		FIN_HOYO: 'F',
		FIN_ACCIONES: 'C'
	}

});

