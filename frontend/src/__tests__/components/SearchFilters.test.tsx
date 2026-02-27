import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilters } from '@/components/missions/SearchFilters';

describe('SearchFilters', () => {
  it('should render search input and filters', () => {
    const onSearch = vi.fn();
    const onReset = vi.fn();

    render(<SearchFilters onSearch={onSearch} onReset={onReset} />);

    expect(screen.getByPlaceholderText('Titre ou description...')).toBeInTheDocument();
    expect(screen.getByText('Recherche')).toBeInTheDocument();
    expect(screen.getByText('Catégorie')).toBeInTheDocument();
    expect(screen.getByText('Urgence')).toBeInTheDocument();
    expect(screen.getByText('Statut')).toBeInTheDocument();
    expect(screen.getByText('Tri')).toBeInTheDocument();
  });

  it('should call onSearch when clicking search button', async () => {
    const onSearch = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilters onSearch={onSearch} onReset={onReset} />);

    const searchInput = screen.getByPlaceholderText('Titre ou description...');
    await user.type(searchInput, 'test mission');

    const searchButton = screen.getByRole('button', { name: /rechercher/i });
    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        q: 'test mission',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      })
    );
  });

  it('should call onSearch when pressing Enter in search input', async () => {
    const onSearch = vi.fn();
    const onReset = vi.fn();

    render(<SearchFilters onSearch={onSearch} onReset={onReset} />);

    const searchInput = screen.getByPlaceholderText('Titre ou description...');
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(onSearch).toHaveBeenCalled();
  });

  it('should reset all filters when clicking reset button', async () => {
    const onSearch = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilters onSearch={onSearch} onReset={onReset} />);

    // Type in search input
    const searchInput = screen.getByPlaceholderText('Titre ou description...');
    await user.type(searchInput, 'test mission');

    // Click reset button (X icon button)
    const resetButton = screen.getAllByRole('button').find(
      (btn) => btn.querySelector('svg.lucide-x')
    );
    
    if (resetButton) {
      await user.click(resetButton);
    }

    expect(onReset).toHaveBeenCalled();
    expect(searchInput).toHaveValue('');
  });

  it('should not include empty filter values in search', async () => {
    const onSearch = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilters onSearch={onSearch} onReset={onReset} />);

    // Click search without filling anything
    const searchButton = screen.getByRole('button', { name: /rechercher/i });
    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledWith({
      q: undefined,
      category: undefined,
      urgency: undefined,
      status: undefined,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  });

  it('should update search input value', async () => {
    const onSearch = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilters onSearch={onSearch} onReset={onReset} />);

    const searchInput = screen.getByPlaceholderText('Titre ou description...');
    await user.type(searchInput, 'new search term');

    expect(searchInput).toHaveValue('new search term');
  });
});
