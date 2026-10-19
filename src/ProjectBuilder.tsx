import { useState, type FormEvent } from 'react'

interface Service { id: number; name: string; price: number }
interface ServiceItem { service: Service; quantity: number }

const availableServices: Service[] = [
  { id: 1, name: 'Разработка лендинга', price: 50000 },
  { id: 2, name: 'Интернет-магазин', price: 150000 },
  { id: 3, name: 'Корпоративный портал', price: 300000 },
  { id: 4, name: 'SEO-оптимизация', price: 20000 },
]
const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

export default function ProjectBuilder() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const numericQuantity = Number(quantity)
  const validQuantity = quantity.trim() !== '' && Number.isInteger(numericQuantity) && numericQuantity >= 1 && numericQuantity <= 10
  const totalPrice = selectedServices.reduce((total, item) => total + item.service.price * item.quantity, 0)

  function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const service = availableServices.find(item => item.id === Number(selectedServiceId))
    if (!service || !validQuantity) return
    setSelectedServices(previous => previous.some(item => item.service.id === service.id)
      ? previous.map(item => item.service.id === service.id ? { ...item, quantity: item.quantity + numericQuantity } : item)
      : [...previous, { service, quantity: numericQuantity }])
  }

  function removeService(serviceId: number) {
    setSelectedServices(previous => previous.filter(item => item.service.id !== serviceId))
  }

  return <main className="project-builder">
    <h1>Состав проекта</h1>
    <p>Выберите услуги и рассчитайте стоимость проекта.</p>
    <form onSubmit={addService} className="add-service">
      <label>Услуга<select value={selectedServiceId} onChange={event => setSelectedServiceId(event.target.value)}>
        <option value="" disabled>Выберите услугу</option>
        {availableServices.map(service => <option key={service.id} value={service.id}>{service.name} — {money(service.price)}</option>)}
      </select></label>
      <label>Количество<input type="number" min={1} max={10} step={1} value={quantity} onChange={event => setQuantity(event.target.value)} aria-describedby="quantity-help" aria-invalid={!validQuantity} /></label>
      <button type="submit" disabled={!selectedServiceId || !validQuantity}>Добавить</button>
    </form>
    <p id="quantity-help" className={validQuantity ? 'hint' : 'error'}>За одно добавление: целое число от 1 до 10. Повторное добавление суммирует количество.</p>
    {selectedServices.length > 0 ? <div className="table-scroll"><table>
      <caption>Выбранные услуги</caption>
      <thead><tr><th scope="col">Услуга</th><th scope="col">Цена за ед.</th><th scope="col">Кол-во</th><th scope="col">Сумма</th><th scope="col">Действия</th></tr></thead>
      <tbody>{selectedServices.map(item => <tr key={item.service.id}>
        <td>{item.service.name}</td><td>{money(item.service.price)}</td><td>{item.quantity}</td><td>{money(item.service.price * item.quantity)}</td>
        <td><button type="button" className="remove" aria-label={`Удалить: ${item.service.name}`} onClick={() => removeService(item.service.id)}>Удалить</button></td>
      </tr>)}</tbody>
      <tfoot><tr><th scope="row" colSpan={3}>Итого:</th><td colSpan={2} aria-live="polite"><strong>{money(totalPrice)}</strong></td></tr></tfoot>
    </table></div> : <p className="empty" role="status">Пока не добавлено ни одной услуги</p>}
  </main>
}
