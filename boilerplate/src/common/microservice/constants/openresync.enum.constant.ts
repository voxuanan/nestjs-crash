export const OPENRESYNC_QUEUE = 'openresync.eventBusQueue';

export enum OPENRESYNC_QUEUE_JOB {
    EVENT_PROPERTY_CREATED = 'propertyCreated',
    EVENT_PROPERTY_UPDATED = 'propertyUpdated',
    EVENT_PROPERTY_CREATED_OR_UPDATED = 'propertyCreatedOrUpdated',
    EVENT_PROPERTY_DELETED = 'propertyDeleted',
    EVENT_PROPERTY_SYNCED = 'propertySynced',
    EVENT_PROPERTY_SYNCED_FAILED = 'propertySyncedFailed',
    EVENT_PROPERTY_SYNCED_SUCCESS = 'propertySyncedSuccess',
}
