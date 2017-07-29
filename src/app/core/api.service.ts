import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { ENV } from './env.config';

import { EventModel } from './models/event.model';
import { RsvpModel } from './models/rsvp.model';

@Injectable()
export class ApiService {

    constructor(
        private http: HttpClient,
        private auth: AuthService,
    ) { }

    private get _authHeader(): string {
        return `Bearer ${localStorage.getItem('access_token')}`;
    }

    // GET list of public future events
    getEvents$(): Observable<EventModel[]> {
        return this.http.get(`${ENV.BASE_API}events`).catch(this._handleError);
    }

    // GET all events - private and public (admin only)
    getAdminEvents$(): Observable<EventModel[]> {
        return this.http
            .get(`${ENV.BASE_API}events/admin`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader),
            })
            .catch(this._handleError);
    }

    // GET and event by id (login required)
    getEventById$(id: string): Observable<EventModel> {
        return this.http
            .get(`${ENV.BASE_API}event/${id}`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader),
            })
            .catch(this._handleError);
    }

    // GET RSVPs for an event (login required)
    getRsvpsByEventId$(id: string): Observable<RsvpModel[]> {
        return this.http
            .get(`${ENV.BASE_API}event/${id}/rsvps`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader),
            })
            .catch(this._handleError);
    }

    // POST new RSVP (login required)
    postRsvp$(rsvp: RsvpModel): Observable<RsvpModel> {
        return this.http
            .post(`${ENV.BASE_API}rsvp/new`, rsvp, {
                headers: new HttpHeaders().set('Authorization', this._authHeader),
            })
            .catch(this._handleError);
    }

    editRsvp$(id: string, rsvp: RsvpModel): Observable<RsvpModel> {
        return this.http
            .put(`${ENV.BASE_API}rsvp/${id}`, rsvp, {
                headers: new HttpHeaders().set('Authorization', this._authHeader),
            })
            .catch(this._handleError);
    }

    private _handleError(err: HttpErrorResponse | any) {
        const errorMsg = err.message || 'Error: Unable to complete request.';
        if (err.message && err.message.indexOf('No JWT present') > -1) {
            this.auth.login();
        }
        return Observable.throw(errorMsg);
    }

}
