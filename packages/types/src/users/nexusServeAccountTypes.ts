import { T_ObjectId } from '../globalTypes'

export type T_AccessLevel = 'basic' | 'manager' | 'admin' | 'executive'

export interface I_WorkSchedule {
    hoursPerWeek: number
    workDays?: string[]
}

export interface I_NexusServeAccount {
    identityId: T_ObjectId
    employeeId: string
    department?: string
    position?: string
    hireDate: Date | string
    managerId?: T_ObjectId
    accessLevel: T_AccessLevel
    workSchedule?: I_WorkSchedule
    createdAt: Date | string
}
