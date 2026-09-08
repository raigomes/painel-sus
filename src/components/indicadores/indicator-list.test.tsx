import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IndicatorList } from '@/components/indicadores/indicator-list';
import { historyData } from '@/data/history';
import { indicatorsList } from '@/data/indicators';
import { ubsList } from '@/data/ubs';

describe('IndicatorList', () => {
  it('starts with all indicators collapsed', () => {
    render(<IndicatorList indicators={indicatorsList} history={historyData} ubs={ubsList} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(4);
    expect(buttons.every((button) => button.getAttribute('aria-expanded') === 'false')).toBe(true);

    for (const indicator of indicatorsList) {
      expect(screen.getByRole('button', { name: new RegExp(indicator.nome, 'i') })).toHaveAttribute(
        'aria-controls',
        `panel-${indicator.id}`,
      );
    }

    expect(screen.queryByText(indicatorsList[0].descricao)).not.toBeInTheDocument();
  });

  it('opens the selected detail and closes the previously open item', () => {
    const { container } = render(
      <IndicatorList indicators={indicatorsList} history={historyData} ubs={ubsList} />,
    );

    const firstButton = screen.getByRole('button', { name: new RegExp(indicatorsList[0].nome, 'i') });
    const secondButton = screen.getByRole('button', { name: new RegExp(indicatorsList[1].nome, 'i') });

    fireEvent.click(firstButton);

    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(indicatorsList[0].descricao)).toBeInTheDocument();

    const panel = container.querySelector(`#panel-${indicatorsList[0].id}`);
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', `btn-${indicatorsList[0].id}`);

    fireEvent.click(secondButton);

    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText(indicatorsList[0].descricao)).not.toBeInTheDocument();
    expect(screen.getByText(indicatorsList[1].descricao)).toBeInTheDocument();

    expect(container.querySelector(`#panel-${indicatorsList[0].id}`)).toBeNull();
    expect(container.querySelector(`#panel-${indicatorsList[1].id}`)).not.toBeNull();
    expect(window.location.pathname).toBe('/');
  });

  it('collapses the open detail when its button is clicked again', () => {
    const { container } = render(
      <IndicatorList indicators={indicatorsList} history={historyData} ubs={ubsList} />,
    );

    const firstButton = screen.getByRole('button', { name: new RegExp(indicatorsList[0].nome, 'i') });

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector(`#panel-${indicatorsList[0].id}`)).not.toBeNull();

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector(`#panel-${indicatorsList[0].id}`)).toBeNull();
  });
});
