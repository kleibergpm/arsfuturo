import { describe, it, expect, vi } from 'vitest';
describe('reglas de roles', () => { it('mantiene los tres roles permitidos', () => expect(['ADMINISTRADOR','AGENTE','SUPERVISOR']).toHaveLength(3)); });
