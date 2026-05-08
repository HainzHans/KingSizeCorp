import { Injectable } from '@angular/core';
import {supabase} from '../../../../core/supabase.client';
import {Appointment, CreateAppointmentDto, UpdateAppointmentDto} from '../../../../shared/models/appointment.model';


@Injectable({ providedIn: 'root' })
export class AppointmentService {

  // -------------------------------------------------------
  // Alle Termine abrufen (Admin-Ansicht, alle Status)
  // -------------------------------------------------------
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;
    return data as Appointment[];
  }

  // -------------------------------------------------------
  // Verfügbare Termine nach Typ abrufen (User-Ansicht)
  // -------------------------------------------------------
  async getAvailableByType(type: Appointment['type']): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('type', type)
      .eq('status', 'available')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;
    return data as Appointment[];
  }

  // -------------------------------------------------------
  // Einzelnen Termin abrufen
  // -------------------------------------------------------
  async getById(id: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Appointment;
  }

  // -------------------------------------------------------
  // Termin erstellen (nur Admin)
  // -------------------------------------------------------
  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  }

  // -------------------------------------------------------
  // Termin bearbeiten (nur Admin)
  // -------------------------------------------------------
  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  }

  // -------------------------------------------------------
  // Termin löschen (nur Admin)
  // -------------------------------------------------------
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('status', 'available')
      .eq('id', id);

    if (error) throw error;
  }

  async deleteExpired(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('status', 'available')
      .lt('date', today);

    if (error) throw error;
  }
}
