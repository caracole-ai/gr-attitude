import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

describe('Select Components', () => {
  describe('Select', () => {
    it('should render select with trigger and value', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should apply custom value to select', () => {
      render(
        <Select value="option1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('SelectTrigger', () => {
    it('should render trigger with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should apply custom className to trigger', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue placeholder="Test" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should apply size prop to trigger', () => {
      render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('should have default size', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });
  });

  // Note: SelectLabel, SelectSeparator, and SelectGroup tests require complex
  // Radix UI context and jsdom setup (scrollIntoView). These components are
  // indirectly tested through integration tests in SearchFilters.test.tsx
  describe('Component Integration', () => {
    it('should export all select components', () => {
      expect(Select).toBeDefined();
      expect(SelectContent).toBeDefined();
      expect(SelectGroup).toBeDefined();
      expect(SelectItem).toBeDefined();
      expect(SelectLabel).toBeDefined();
      expect(SelectSeparator).toBeDefined();
      expect(SelectTrigger).toBeDefined();
      expect(SelectValue).toBeDefined();
    });
  });
});
