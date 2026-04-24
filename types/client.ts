export interface ClientDto {
  id: string
  userId: string
  name: string
  email: string
  address: string | null
  taxNumber: string | null
  createdAt: Date
}

export interface CreateClientDto {
  name: string
  email: string
  address?: string
  taxNumber?: string
}

export interface UpdateClientDto {
  id: string
  name: string
  email: string
  address?: string
  taxNumber?: string
}
