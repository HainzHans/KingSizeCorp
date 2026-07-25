import { Injectable } from '@angular/core';
import { supabase } from '../../../core/supabase.client';
import { Recording, CreateRecordingDto, UpdateRecordingDto } from '../../models/recording.model';

/**
 * Zoom-Aufzeichnungen. Lesen dürfen alle Mentoring-Mitglieder, verwalten nur
 * der Admin – abgesichert über die RLS-Policies auf public.recordings.
 */
@Injectable({ providedIn: 'root' })
export class RecordingService {

  /** Alle Aufzeichnungen, neueste zuerst. */
  async getAll(): Promise<Recording[]> {
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .order('recorded_on', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Recording[];
  }

  /** Aufzeichnung anlegen (nur Admin). */
  async create(dto: CreateRecordingDto): Promise<Recording> {
    const { data, error } = await supabase
      .from('recordings')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data as Recording;
  }

  /** Aufzeichnung bearbeiten (nur Admin). */
  async update(id: string, dto: UpdateRecordingDto): Promise<Recording> {
    const { data, error } = await supabase
      .from('recordings')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Recording;
  }

  /** Aufzeichnung löschen (nur Admin). */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('recordings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
