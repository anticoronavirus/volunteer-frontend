import format from 'date-fns/format'
import ru from 'date-fns/locale/ru'

export const formatDate = date => format(new Date(date), 'd MMMM', { locale: ru })