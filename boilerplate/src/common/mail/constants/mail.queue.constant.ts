export const MAIL_QUEUE = 'mail';
export const MAIL_QUEUE_LIMITTER_MAX = 1;
export const MAIL_QUEUE_LIMITTER_DURATION = 3000;

export enum MAIL_QUEUE_JOB {
    'SEND_MAIL_FORGOT_PASSWORD' = 'mail.sendMailForgotPassword',
    'SEND_MAIL_SAVED_SEARCH' = 'mail.sendMailSavedSearch',
}
