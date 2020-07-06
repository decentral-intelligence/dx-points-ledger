import { Entity } from './Entity'
import { TransactionData } from './TransactionData'

export type TransactionId = string

export interface Transaction extends TransactionData, Entity {}
