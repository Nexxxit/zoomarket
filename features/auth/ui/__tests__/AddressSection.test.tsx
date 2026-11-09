import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressSection from '../AddressSection';
import type { UserAddress } from '@/entities/user';

const saved: UserAddress = {
  street: 'ул. Ленина',
  house: 'д. 12',
  flat: 'кв. 5',
};

function renderSection(onSave = vi.fn().mockResolvedValue(true)) {
  render(<AddressSection address={saved} isSaving={false} onSave={onSave} />);
  return onSave;
}

describe('AddressSection', () => {
  it('shows the formatted saved address', () => {
    renderSection();
    expect(screen.getByText('ул. Ленина, д. 12, кв. 5')).toBeInTheDocument();
  });

  it('asks to add an address when there is none', () => {
    render(<AddressSection address={undefined} isSaving={false} onSave={vi.fn()} />);
    expect(screen.getByText(/Адрес не указан/)).toBeInTheDocument();
  });

  it('blocks saving until street and house are filled', async () => {
    const user = userEvent.setup();
    render(<AddressSection address={undefined} isSaving={false} onSave={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    const save = screen.getByRole('button', { name: 'Сохранить' });
    expect(save).toBeDisabled();
    expect(screen.getByText(/Заполните улицу и дом/)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Улица/), 'ул. Мира');
    expect(save).toBeDisabled();

    await user.type(screen.getByLabelText(/^Дом/), '7');
    expect(save).toBeEnabled();
  });

  it('disables all controls while saving', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <AddressSection address={undefined} isSaving={false} onSave={vi.fn()} />,
    );
    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    await user.type(screen.getByLabelText(/^Улица/), 'ул. Мира');

    rerender(<AddressSection address={undefined} isSaving onSave={vi.fn()} />);
    expect(screen.getByLabelText(/^Улица/)).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Сохраняем...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeDisabled();
  });

  it('prefills fields from the saved address', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    expect(screen.getByLabelText(/^Улица/)).toHaveValue('ул. Ленина');
    expect(screen.getByLabelText(/^Дом/)).toHaveValue('д. 12');
    expect(screen.getByLabelText(/Квартира/)).toHaveValue('кв. 5');
    expect(screen.getByLabelText(/Подъезд/)).toHaveValue('');
  });

  it('saves a trimmed structured address', async () => {
    const user = userEvent.setup();
    const onSave = renderSection();

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    await user.clear(screen.getByLabelText(/^Улица/));
    await user.type(screen.getByLabelText(/^Улица/), '  ул. Тверская  ');
    await user.clear(screen.getByLabelText(/^Дом/));
    await user.type(screen.getByLabelText(/^Дом/), ' д. 1 ');
    await user.clear(screen.getByLabelText(/Квартира/));
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onSave).toHaveBeenCalledWith({
      street: 'ул. Тверская',
      house: 'д. 1',
      flat: undefined,
      entrance: undefined,
    });
  });

  it('cancels editing without calling onSave and reopens with saved values', async () => {
    const user = userEvent.setup();
    const onSave = renderSection();

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    await user.clear(screen.getByLabelText(/^Улица/));
    await user.type(screen.getByLabelText(/^Улица/), 'несохранённая');
    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('ул. Ленина, д. 12, кв. 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    expect(screen.getByLabelText(/^Улица/)).toHaveValue('ул. Ленина');
  });

  it('stays in edit mode when saving fails', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(false);
    render(<AddressSection address={undefined} isSaving={false} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Изменить' }));
    await user.type(screen.getByLabelText(/^Улица/), 'ул. Мира');
    await user.type(screen.getByLabelText(/^Дом/), '1');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByLabelText(/^Улица/)).toBeInTheDocument();
  });
});
