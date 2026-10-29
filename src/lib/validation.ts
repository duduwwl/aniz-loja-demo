// Validação do checkout. Mensagens específicas, em português, uma por campo.
export interface Identity { name: string; email: string; phone: string }
export interface Address { cep: string; street: string; number: string; complement: string; district: string; city: string; uf: string }
export type Errors<T> = Partial<Record<keyof T, string>>;

export const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
const digits = (s: string) => s.replace(/\D/g, '');

export function maskPhone(v: string) {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCep(v: string) {
  const d = digits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function validateIdentity(v: Identity): Errors<Identity> {
  const e: Errors<Identity> = {};
  const name = v.name.trim();
  if (!name) e.name = 'Informe seu nome completo.';
  else if (name.split(/\s+/).length < 2) e.name = 'Informe nome e sobrenome.';
  if (!v.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'E-mail inválido. Exemplo: nome@email.com';
  const p = digits(v.phone);
  if (!p) e.phone = 'Informe um telefone com DDD.';
  else if (p.length < 10) e.phone = 'Telefone incompleto. Use DDD + número, ex.: (35) 99999-9999.';
  else if (p.length === 11 && p[2] !== '9') e.phone = 'Celular com 11 dígitos deve começar com 9 após o DDD.';
  return e;
}

export function validateAddress(v: Address): Errors<Address> {
  const e: Errors<Address> = {};
  const cep = digits(v.cep);
  if (!cep) e.cep = 'Informe o CEP.';
  else if (cep.length !== 8) e.cep = 'O CEP deve ter 8 dígitos, ex.: 37200-000.';
  if (v.street.trim().length < 3) e.street = 'Informe a rua ou avenida.';
  if (!v.number.trim()) e.number = 'Informe o número (ou “s/n”).';
  if (v.district.trim().length < 2) e.district = 'Informe o bairro.';
  if (v.city.trim().length < 2) e.city = 'Informe a cidade.';
  if (!UFS.includes(v.uf)) e.uf = 'Selecione o estado.';
  return e;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;
