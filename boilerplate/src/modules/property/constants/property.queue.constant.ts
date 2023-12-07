import {
    OPENRESYNC_QUEUE,
    OPENRESYNC_QUEUE_JOB,
} from 'src/common/microservice/constants/openresync.enum.constant';

export const PROPERTY_QUEUE = OPENRESYNC_QUEUE;
export const PROPERTY_QUEUE_QUEUE_LIMITTER_MAX = 2;
export const PROPERTY_QUEUE_QUEUE_LIMITTER_DURATION = 1000;

export enum PROPERTY_QUEUE_JOB {
    PROPERTY_SYNCED = 'propertySynced', //OPENRESYNC_QUEUE_JOB.EVENT_PROPERTY_SYNCED,
}
