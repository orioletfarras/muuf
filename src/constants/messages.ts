/**
 * Application messages and text constants
 */

export const Messages = {
  // Success messages
  SUCCESS: {
    ACTIVITY_CREATED: '¡Actividad registrada correctamente!',
    ACTIVITY_DELETED: 'Actividad eliminada',
    PROFILE_UPDATED: 'Perfil actualizado correctamente',
    BADGE_FEATURED: 'Insignia destacada actualizada',
    LOGIN_SUCCESS: '¡Bienvenido de vuelta!',
    REGISTRATION_SUCCESS: 'Cuenta creada exitosamente',
  },

  // Error messages
  ERROR: {
    GENERIC: 'Ha ocurrido un error. Por favor intenta de nuevo.',
    NETWORK: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
    ACTIVITY_CREATE_FAILED: 'No se pudo crear la actividad',
    ACTIVITY_DELETE_FAILED: 'No se pudo eliminar la actividad',
    PROFILE_UPDATE_FAILED: 'No se pudo actualizar el perfil',
    LOGIN_FAILED: 'Error al iniciar sesión',
    REGISTRATION_FAILED: 'Error al registrarse',
    FETCH_DATA_FAILED: 'No se pudieron cargar los datos',
  },

  // Validation messages
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Email inválido',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
    PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
    INVALID_DURATION: 'Ingresa una duración válida',
    INVALID_DISTANCE: 'Ingresa una distancia válida',
    SELECT_ACTIVITY_TYPE: 'Selecciona un tipo de actividad',
    COMPLETE_ALL_FIELDS: 'Por favor completa todos los campos',
  },

  // Confirmation messages
  CONFIRM: {
    DELETE_ACTIVITY: '¿Estás seguro de que quieres eliminar esta actividad?',
    LOGOUT: '¿Estás seguro de que quieres cerrar sesión?',
    DISCARD_CHANGES: '¿Descartar cambios?',
  },

  // Info messages
  INFO: {
    NO_ACTIVITIES: 'No hay actividades registradas',
    NO_BADGES: 'No hay insignias disponibles',
    NO_STATS: 'No hay estadísticas disponibles',
    LOADING: 'Cargando...',
    COMING_SOON: 'Funcionalidad próximamente',
  },

  // Empty state messages
  EMPTY_STATE: {
    ACTIVITIES: {
      TITLE: 'No hay actividades',
      MESSAGE: 'Registra tu primera actividad para comenzar tu viaje de bienestar',
      ACTION: '+ Nueva Actividad',
    },
    BADGES: {
      TITLE: 'Sin insignias',
      MESSAGE: 'Completa actividades para desbloquear insignias',
    },
    RANKING: {
      TITLE: 'Sin ranking',
      MESSAGE: 'Aún no hay participantes en el ranking',
    },
  },

  // Loading messages
  LOADING: {
    ACTIVITIES: 'Cargando actividades...',
    BADGES: 'Cargando insignias...',
    STATS: 'Cargando estadísticas...',
    PROFILE: 'Cargando perfil...',
  },

  // Button labels
  BUTTONS: {
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
    SUBMIT: 'Enviar',
    RETRY: 'Reintentar',
    LOGIN: 'Iniciar Sesión',
    REGISTER: 'Registrarse',
    LOGOUT: 'Cerrar Sesión',
    CREATE: 'Crear',
    UPDATE: 'Actualizar',
    CONFIRM: 'Confirmar',
    BACK: 'Atrás',
  },

  // Screen titles
  TITLES: {
    LOGIN: 'Iniciar Sesión',
    REGISTER: 'Crear Cuenta',
    HOME: 'Inicio',
    ACTIVITIES: 'Mis Actividades',
    CREATE_ACTIVITY: 'Nueva Actividad',
    STATS: 'Estadísticas',
    PROFILE: 'Mi Perfil',
    BADGES: 'Insignias',
  },

  // Subtitles
  SUBTITLES: {
    LOGIN: 'Inicia sesión para continuar tu viaje de bienestar',
    REGISTER: 'Únete a la comunidad de bienestar',
  },
} as const;
