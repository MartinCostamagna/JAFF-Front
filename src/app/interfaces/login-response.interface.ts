export interface UsuarioSesion {
    idUsuario: number;
    nombre: string;
    apellido: string;
    rol: string;
}

export interface LoginResponse {
    access_token: string;
    usuario: UsuarioSesion;
}