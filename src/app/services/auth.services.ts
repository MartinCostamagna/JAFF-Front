import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginCredentials } from '../interfaces/login-credentials.interface';
import { LoginResponse, UsuarioSesion } from '../interfaces/login-response.interface';

const TOKEN_KEY = 'jaff_token';
const USUARIO_KEY = 'jaff_usuario';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUrl = 'http://localhost:3000/auth';
    private authStatusSubject = new BehaviorSubject<boolean>(this.tieneTokenValido());
    public authStatus$ = this.authStatusSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
            tap((respuesta) => {
                localStorage.setItem(TOKEN_KEY, respuesta.access_token);
                localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.usuario));
                this.authStatusSubject.next(true);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USUARIO_KEY);
        this.authStatusSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    getUsuario(): UsuarioSesion | null {
        const guardado = localStorage.getItem(USUARIO_KEY);
        if (!guardado) {
            return null;
        }
        try {
            return JSON.parse(guardado) as UsuarioSesion;
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return this.tieneTokenValido();
    }

    esDuena(): boolean {
        return this.getUsuario()?.rol === 'Dueña';
    }

    private tieneTokenValido(): boolean {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return false;
        }
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }
}

