import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProjectBuilder from './ProjectBuilder'

describe('Состав проекта', () => {
  it('обновляет форму, добавляет и объединяет услуги, пересчитывает итог и удаляет строки', async () => {
    const user = userEvent.setup()
    render(<ProjectBuilder />)
    const add = screen.getByRole('button', { name: 'Добавить' })
    expect(add).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Услуга'), '1')
    expect(add).toBeEnabled()
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '2' } })
    await user.click(add)
    await user.click(add)
    let row = screen.getByText('Разработка лендинга', { selector: 'td' }).closest('tr')!
    expect(within(row).getByText('4')).toBeInTheDocument()
    expect(within(row).getByText(/200\s000 ₽/)).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Услуга'), '4')
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '1' } })
    await user.click(add)
    expect(screen.getByText(/220\s000 ₽/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Удалить: Разработка лендинга' }))
    expect(screen.queryByText('Разработка лендинга', { selector: 'td' })).not.toBeInTheDocument()
    expect(screen.getByText(/20\s000 ₽/, { selector: 'strong' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Удалить: SEO-оптимизация' }))
    expect(screen.getByRole('status')).toHaveTextContent('Пока не добавлено')
  })

  it.each(['', '0', '-1', '11', '1.5'])('отклоняет недопустимое количество %j даже при отправке формы', async value => {
    const user = userEvent.setup()
    render(<ProjectBuilder />)
    await user.selectOptions(screen.getByLabelText('Услуга'), '1')
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value } })
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeDisabled()
    fireEvent.submit(screen.getByRole('button', { name: 'Добавить' }).closest('form')!)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('принимает верхнюю границу количества', async () => {
    const user = userEvent.setup()
    render(<ProjectBuilder />)
    await user.selectOptions(screen.getByLabelText('Услуга'), '3')
    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '10' } })
    await user.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText(/3\s000\s000 ₽/, { selector: 'strong' })).toBeInTheDocument()
  })
})
