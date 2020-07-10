import { TransactionData } from './TransactionData'
import { Entity } from './Entity'

export type TransactionId = string

export interface Transaction extends TransactionData, Entity {}
