import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { TripProvider } from '../../src/context/TripContext';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { DisruptionsPage } from '../../src/pages/DisruptionsPage';
import { BudgetPage } from '../../src/pages/BudgetPage';
import { LandingPage } from '../../src/pages/LandingPage';

describe('TravelPilot Component & Page Integration Tests', () => {
  it('renders LandingPage with hero and features', () => {
    render(
      <AuthProvider>
        <TripProvider>
          <MemoryRouter>
            <LandingPage />
          </MemoryRouter>
        </TripProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Your Trip That/i)).toBeInTheDocument();
    expect(screen.getByText(/Heals Itself./i)).toBeInTheDocument();
    expect(screen.getByText(/AI Trip Planning/i)).toBeInTheDocument();
  });

  it('renders DashboardPage with metrics and trip overview', () => {
    render(
      <AuthProvider>
        <TripProvider>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </TripProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Goa Escape/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Risk Radar/i)).toBeInTheDocument();
  });

  it('renders DisruptionsPage with simulation buttons and impact radius', () => {
    render(
      <AuthProvider>
        <TripProvider>
          <MemoryRouter>
            <DisruptionsPage />
          </MemoryRouter>
        </TripProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Disruption Center & Impact Analysis/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Simulate Museum Closure/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Impact Radius Assessment/i)).toBeInTheDocument();
  });

  it('renders BudgetPage with finance overview and charts', () => {
    render(
      <AuthProvider>
        <TripProvider>
          <MemoryRouter>
            <BudgetPage />
          </MemoryRouter>
        </TripProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Smart Budget Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Expenditure by Category/i)).toBeInTheDocument();
  });
});
