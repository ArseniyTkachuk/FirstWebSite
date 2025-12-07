import { body } from 'express-validator'

export const loginValidator = [
    body('email', 'Неправильний формат адреси').isEmail(),
    body('password', 'Пароль має складатися мінімум з 5 символів').isLength({ min: 5}),
]

export const registerValidator = [
    body('email', 'Неправильний формат адреси').isEmail(),
    body('password', 'Пароль має складатися мінімум з 5 символів').isLength({ min: 5}),
    body('fullName', 'Імя має складатися мінімум з 3 символів').isLength({ min: 3}),
    body('avatarUrl', 'Неправильне посилання на аватарку').optional().isURL()
]

export const postCreateValidator = [
    body('title', 'Загаловок має складатися як мінімум з 3 символів').isLength({min: 3}).isString(),
    body('text', 'Опис має складатися як мінімум з 10 символів').isLength({min: 10}).isString(),
    body('tags', 'Не вірний формат тегів').optional().isArray(),
    body('imageUrl', 'Невірне посилання на зображення').optional().isString()
]
