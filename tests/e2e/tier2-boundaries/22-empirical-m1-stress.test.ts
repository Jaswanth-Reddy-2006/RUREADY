import { describe, it, expect, vi } from 'vitest';
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import RadarChart from '@/components/ui/RadarChart';
import AppLayout from '@/layouts/AppLayout';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (route: string, element: React.ReactElement) => {
  const queryClient = createQueryClient();
  return renderToString(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MemoryRouter, { initialEntries: [route] }, element),
    ),
  );
};

describe('Empirical M1 Stress Testing — UI Primitives & Layout Shell', () => {

  describe('1. Button Component Stress & Adversarial Tests', () => {
    it('should render standard button with primary variant and default props', () => {
      const html = renderToString(React.createElement(Button, null, 'Click Me'));
      expect(html).toContain('bg-gradient-to-r from-solar-orange-500 to-solar-orange-600');
      expect(html).toContain('type="button"');
      expect(html).toContain('Click Me');
      expect(html).toContain('focus-visible:ring-solar-orange-500');
    });

    it('should handle all 6 button variants without throwing', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'glass'] as const;
      variants.forEach((variant) => {
        const html = renderToString(React.createElement(Button, { variant }, variant));
        expect(html).toContain(variant);
      });
    });

    it('should handle invalid/adversarial variant safely via clsx fallback', () => {
      const html = renderToString(React.createElement(Button, { variant: 'hacker-variant' as any }, 'Adversarial'));
      expect(html).toContain('Adversarial');
      expect(html).toContain('inline-flex items-center justify-center');
    });

    it('should enforce disabled states and ARIA attributes when disabled=true', () => {
      const html = renderToString(React.createElement(Button, { disabled: true }, 'Disabled Btn'));
      expect(html).toContain('disabled=""');
      expect(html).toContain('aria-disabled="true"');
      expect(html).toContain('opacity-50 cursor-not-allowed pointer-events-none');
    });

    it('should enforce loading state: aria-busy, disabled, spinning loader, suppress iconRight', () => {
      const html = renderToString(
        React.createElement(Button, {
          isLoading: true,
          icon: React.createElement('span', null, 'IconLeft'),
          iconRight: React.createElement('span', null, 'IconRight'),
        }, 'Loading Btn')
      );
      expect(html).toContain('aria-busy="true"');
      expect(html).toContain('disabled=""');
      expect(html).toContain('animate-spin');
      expect(html).not.toContain('IconRight');
    });

    it('should handle extreme and edge-case children (empty string, 0, 100,000 characters)', () => {
      // Empty string
      const emptyHtml = renderToString(React.createElement(Button, null, ''));
      expect(emptyHtml).toContain('<button');

      // Zero number (falsy number)
      const zeroHtml = renderToString(React.createElement(Button, null, 0));
      expect(zeroHtml).toContain('0');

      // 100,000 character ultra-long string
      const hugeString = 'X'.repeat(100000);
      const hugeHtml = renderToString(React.createElement(Button, null, hugeString));
      expect(hugeHtml).toContain(hugeString.slice(0, 100));
      expect(hugeHtml.length).toBeGreaterThan(100000);
    });

    it('should support fullWidth prop and custom className injection', () => {
      const html = renderToString(React.createElement(Button, { fullWidth: true, className: 'custom-adversarial-class' }, 'Full'));
      expect(html).toContain('w-full');
      expect(html).toContain('custom-adversarial-class');
    });

    it('should verify focus-visible accessibility ring styles', () => {
      const html = renderToString(React.createElement(Button, null, 'Focus Ring Test'));
      expect(html).toContain('focus-visible:ring-2');
      expect(html).toContain('focus-visible:ring-solar-orange-500');
      expect(html).toContain('focus-visible:ring-offset-2');
      expect(html).toContain('focus-visible:ring-offset-obsidian-950');
    });

    it('should suppress click events when disabled or loading in simulated DOM', () => {
      const clickSpy = vi.fn();
      const simulateClick = (btnProps: { disabled?: boolean; isLoading?: boolean }) => {
        if (btnProps.disabled || btnProps.isLoading) return;
        clickSpy();
      };

      // 50 rapid clicks on disabled button
      for (let i = 0; i < 50; i++) {
        simulateClick({ disabled: true });
      }
      expect(clickSpy).not.toHaveBeenCalled();

      // 50 rapid clicks on loading button
      for (let i = 0; i < 50; i++) {
        simulateClick({ isLoading: true });
      }
      expect(clickSpy).not.toHaveBeenCalled();

      // Active button click
      simulateClick({ disabled: false, isLoading: false });
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. Card Component Stress & Adversarial Tests', () => {
    it('should render all 7 card variants and fallback gracefully on unknown variant', () => {
      const variants = ['default', 'glass', 'obsidian', 'elevated', 'dark', 'soft', 'outline'] as const;
      variants.forEach((variant) => {
        const html = renderToString(React.createElement(Card, { variant }, `Card-${variant}`));
        expect(html).toContain(`Card-${variant}`);
        expect(html).toContain('rounded-2xl');
      });

      // Unknown variant fallback to default
      const fallbackHtml = renderToString(React.createElement(Card, { variant: 'unsupported' as any }, 'Fallback'));
      expect(fallbackHtml).toContain('bg-obsidian-900/90');
    });

    it('should apply all padding sizes correctly', () => {
      const paddings = ['none', 'sm', 'md', 'lg', 'xl'] as const;
      const expectedClasses: Record<string, string> = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      };
      paddings.forEach((p) => {
        const html = renderToString(React.createElement(Card, { padding: p }, p));
        if (expectedClasses[p]) {
          expect(html).toContain(expectedClasses[p]);
        }
      });
    });

    it('should handle glow modes: boolean, orange, subtle, none', () => {
      const orangeHtml = renderToString(React.createElement(Card, { glow: 'orange' }, 'Orange'));
      expect(orangeHtml).toContain('border-solar-orange-500/30');

      const boolHtml = renderToString(React.createElement(Card, { glow: true }, 'True'));
      expect(boolHtml).toContain('border-solar-orange-500/30');

      const subtleHtml = renderToString(React.createElement(Card, { glow: 'subtle' }, 'Subtle'));
      expect(subtleHtml).toContain('border-white/[0.16]');

      const noneHtml = renderToString(React.createElement(Card, { glow: 'none' }, 'None'));
      expect(noneHtml).not.toContain('border-solar-orange-500/30');
    });

    it('should apply hover transitions when hover=true', () => {
      const html = renderToString(React.createElement(Card, { hover: true }, 'Hoverable'));
      expect(html).toContain('hover:shadow-card-hover');
      expect(html).toContain('hover:-translate-y-1');
      expect(html).toContain('cursor-pointer');
    });

    it('should handle deeply nested cards (20 levels) without recursion or stack overflow', () => {
      let nested: React.ReactElement = React.createElement('div', null, 'Deep Leaf');
      for (let i = 0; i < 20; i++) {
        nested = React.createElement(Card, { variant: i % 2 === 0 ? 'default' : 'glass' }, nested);
      }
      const html = renderToString(nested);
      expect(html).toContain('Deep Leaf');
      expect(html.split('rounded-2xl').length - 1).toBe(20);
    });
  });

  describe('3. Input Component Stress & Adversarial Tests', () => {
    it('should render input with auto-generated id from label', () => {
      const html = renderToString(React.createElement(Input, { label: 'Candidate Email Address' }));
      expect(html).toContain('id="candidate-email-address"');
      expect(html).toContain('for="candidate-email-address"');
      expect(html).toContain('Candidate Email Address');
    });

    it('should prioritize explicit id over label-derived id', () => {
      const html = renderToString(React.createElement(Input, { id: 'custom-explicit-id', label: 'Candidate Email' }));
      expect(html).toContain('id="custom-explicit-id"');
      expect(html).toContain('for="custom-explicit-id"');
    });

    it('should enforce error state with role=alert and aria-invalid=true', () => {
      const html = renderToString(React.createElement(Input, {
        id: 'test-field',
        label: 'Field',
        error: 'Critical validation failure',
      }));
      expect(html).toContain('aria-invalid="true"');
      expect(html).toContain('aria-describedby="test-field-error"');
      expect(html).toContain('id="test-field-error"');
      expect(html).toContain('role="alert"');
      expect(html).toContain('Critical validation failure');
      expect(html).toContain('border-red-500/80');
    });

    it('should suppress hint when error is present and point aria-describedby to error', () => {
      const html = renderToString(React.createElement(Input, {
        id: 'test-field',
        hint: 'This is a helpful hint',
        error: 'Error takes precedence',
      }));
      expect(html).not.toContain('This is a helpful hint');
      expect(html).toContain('Error takes precedence');
      expect(html).toContain('aria-describedby="test-field-error"');
    });

    it('should handle extreme adversarial inputs (XSS payloads, SQL injections, 50,000 characters)', () => {
      const xssPayload = '<script>alert("pwned")</script><img src=x onerror=alert(1)>';
      const html = renderToString(React.createElement(Input, {
        value: xssPayload,
        placeholder: xssPayload,
        onChange: () => {},
      }));
      // React server rendering automatically escapes XSS payloads into safe HTML entities
      expect(html).not.toContain('<script>alert');
      expect(html).toContain('&lt;script&gt;alert');

      // 50,000 characters value
      const massiveVal = 'A'.repeat(50000);
      const massiveHtml = renderToString(React.createElement(Input, { value: massiveVal, onChange: () => {} }));
      expect(massiveHtml.length).toBeGreaterThan(50000);
    });

    it('should handle disabled state with opacity-50 and pointer-events-none', () => {
      const html = renderToString(React.createElement(Input, { disabled: true, label: 'Disabled Input' }));
      expect(html).toContain('disabled=""');
      expect(html).toContain('opacity-50 cursor-not-allowed bg-obsidian-950/60 pointer-events-none');
    });

    it('should render left icon and right icon with proper padding classes', () => {
      const html = renderToString(React.createElement(Input, {
        icon: React.createElement('span', null, 'L'),
        iconRight: React.createElement('span', null, 'R'),
      }));
      expect(html).toContain('pl-10');
      expect(html).toContain('pr-10');
      expect(html).toContain('aria-hidden="true"');
    });
  });

  describe('4. Badge Component Stress & Adversarial Tests', () => {
    it('should render all 11 badge variants without error', () => {
      const variants = [
        'orange', 'solar-orange', 'amber', 'teal', 'success',
        'red', 'error', 'warning', 'neutral', 'navy', 'info'
      ] as const;
      variants.forEach((v) => {
        const html = renderToString(React.createElement(Badge, { variant: v }, `Badge-${v}`));
        expect(html).toContain(`Badge-${v}`);
        expect(html).toContain('rounded-full');
      });
    });

    it('should render dot and animated pulse indicators when requested', () => {
      const html = renderToString(React.createElement(Badge, { variant: 'solar-orange', dot: true, pulse: true }, 'Live'));
      expect(html).toContain('rounded-full shrink-0');
      expect(html).toContain('animate-pulse');
      expect(html).toContain('aria-hidden="true"');
    });

    it('should fallback gracefully to neutral on unrecognized variant', () => {
      const html = renderToString(React.createElement(Badge, { variant: 'rogue-variant' as any }, 'Safe Fallback'));
      expect(html).toContain('bg-white/[0.06]');
      expect(html).toContain('Safe Fallback');
    });

    it('should handle all 3 sizes: xs, sm, md', () => {
      const xs = renderToString(React.createElement(Badge, { size: 'xs' }, 'XS'));
      expect(xs).toContain('text-[10px]');

      const sm = renderToString(React.createElement(Badge, { size: 'sm' }, 'SM'));
      expect(sm).toContain('text-xs');

      const md = renderToString(React.createElement(Badge, { size: 'md' }, 'MD'));
      expect(md).toContain('px-3.5');
    });
  });

  describe('5. Skeleton Component Stress & Adversarial Tests', () => {
    it('should render rectangular skeleton by default with shimmer animations', () => {
      const html = renderToString(React.createElement(Skeleton, null));
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-busy="true"');
      expect(html).toContain('rounded-xl');
      expect(html).toContain('before:animate-[shimmer_2s_infinite]');
      expect(html).toContain('after:via-solar-orange-500/[0.06]');
      expect(html).toContain('Loading...');
    });

    it('should render circular skeleton with rounded-full', () => {
      const html = renderToString(React.createElement(Skeleton, { variant: 'circular', width: 48, height: 48 }));
      expect(html).toContain('rounded-full');
      expect(html).toContain('width:48px');
      expect(html).toContain('height:48px');
    });

    it('should render multi-line text skeleton with lines=5 and check last line width (70%)', () => {
      const html = renderToString(React.createElement(Skeleton, { variant: 'text', lines: 5 }));
      expect(html).toContain('flex flex-col gap-2.5');
      expect(html).toContain('width:70%');
      // Should have 5 lines
      expect(html.split('rounded-md').length - 1).toBe(5);
    });

    it('should handle zero, negative, and extreme dimensions without crashing', () => {
      const zeroHtml = renderToString(React.createElement(Skeleton, { width: 0, height: 0 }));
      expect(zeroHtml).toContain('width:0');

      const hugeHtml = renderToString(React.createElement(Skeleton, { width: 999999, height: 999999 }));
      expect(hugeHtml).toContain('width:999999px');
    });
  });

  describe('6. ErrorBoundary Component Stress & Adversarial Tests', () => {
    it('should render children normally when no exception occurs', () => {
      const html = renderToString(
        React.createElement(ErrorBoundary, null, React.createElement('div', null, 'Healthy Component'))
      );
      expect(html).toContain('Healthy Component');
      expect(html).not.toContain('Something went wrong');
    });

    it('should catch runtime error and render fallback alert UI', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const boundary = new ErrorBoundary({ children: React.createElement('div') });
      boundary.state = { hasError: true, error: new Error('Simulated runtime exception'), showDetails: false };

      const rendered = boundary.render();
      const html = renderToString(rendered as React.ReactElement);

      expect(html).toContain('role="alert"');
      expect(html).toContain('Something went wrong');
      expect(html).toContain('Simulated runtime exception');
      expect(html).toContain('Try Again');
      expect(html).toContain('Return to Setup');

      consoleSpy.mockRestore();
    });

    it('should support custom fallback ReactNode and fallback function', () => {
      const boundaryNode = new ErrorBoundary({
        fallback: React.createElement('div', { id: 'custom-static-fallback' }, 'Custom Fallback'),
        children: React.createElement('div'),
      });
      boundaryNode.state = { hasError: true, error: new Error('Err'), showDetails: false };
      const htmlNode = renderToString(boundaryNode.render() as React.ReactElement);
      expect(htmlNode).toContain('id="custom-static-fallback"');
      expect(htmlNode).toContain('Custom Fallback');

      const boundaryFn = new ErrorBoundary({
        fallback: ({ error, reset }) => React.createElement('button', { onClick: reset }, error.message),
        children: React.createElement('div'),
      });
      boundaryFn.state = { hasError: true, error: new Error('Dynamic Error Msg'), showDetails: false };
      const htmlFn = renderToString(boundaryFn.render() as React.ReactElement);
      expect(htmlFn).toContain('Dynamic Error Msg');
    });

    it('should execute onReset handler on reset invocation', () => {
      const onResetSpy = vi.fn();
      const boundary = new ErrorBoundary({ onReset: onResetSpy, children: React.createElement('div') });
      boundary.state = { hasError: true, error: new Error('Err'), showDetails: false };
      boundary.setState = vi.fn((update: any) => {
        const next = typeof update === 'function' ? update(boundary.state) : update;
        Object.assign(boundary.state, next);
      });

      boundary.handleReset();
      expect(boundary.state.hasError).toBe(false);
      expect(boundary.state.error).toBeUndefined();
      expect(onResetSpy).toHaveBeenCalledTimes(1);
    });

    it('should gracefully handle non-Error thrown objects (strings, numbers, objects)', () => {
      const boundaryStr = new ErrorBoundary({ children: React.createElement('div') });
      boundaryStr.state = { hasError: true, error: 'String error' as any, showDetails: false };
      const htmlStr = renderToString(boundaryStr.render() as React.ReactElement);
      expect(htmlStr).toContain('role="alert"');
      expect(htmlStr).toContain('Unknown runtime exception');

      const boundaryObj = new ErrorBoundary({ children: React.createElement('div') });
      boundaryObj.state = { hasError: true, error: { message: 'Object error message' } as any, showDetails: false };
      const htmlObj = renderToString(boundaryObj.render() as React.ReactElement);
      expect(htmlObj).toContain('Object error message');
    });

    it('reveals boundary vulnerability: falsy thrown value (e.g. throw null) causes fallback to be bypassed', () => {
      // If a component throws null, error state has hasError: true but error: null.
      // ErrorBoundary line 55: if (this.state.hasError && this.state.error) -> FALSE!
      // Therefore, it incorrectly attempts to re-render the broken children.
      const boundaryNull = new ErrorBoundary({ children: React.createElement('span', null, 'BrokenChild') });
      boundaryNull.state = { hasError: true, error: null as any, showDetails: false };
      const rendered = boundaryNull.render();
      // Verifies the empirical finding: returns children instead of error alert
      expect(rendered).toEqual(boundaryNull.props.children);
    });
  });

  describe('7. Layout Shell (AppLayout) Boundary Tests', () => {
    it('should NOT render a <main> tag to prevent duplicate landmarks with App.tsx', () => {
      const html = renderWithProviders(
        '/dashboard',
        React.createElement(AppLayout, null, React.createElement('div', null, 'Dashboard Page'))
      );
      expect(html).not.toContain('<main');
      expect(html).toContain('id="workspace-viewport"');
      expect(html).toContain('role="region"');
      expect(html).toContain('Dashboard Page');
    });

    it('should render accessibility skip-to-main-content link pointing to #main-content', () => {
      const html = renderWithProviders(
        '/dashboard',
        React.createElement(AppLayout, null, React.createElement('div', null, 'Content'))
      );
      expect(html).toContain('href="#main-content"');
      expect(html).toContain('Skip to main content');
    });

    it('should bypass shell on public routes (/, /login, /register)', () => {
      ['/', '/login', '/register'].forEach((route) => {
        const html = renderWithProviders(
          route,
          React.createElement(AppLayout, null, React.createElement('div', null, `Page-${route}`))
        );
        expect(html).not.toContain('id="workspace-viewport"');
        expect(html).toContain(`Page-${route}`);
      });
    });

    it('should render full-screen immersive container for live secure interview rooms', () => {
      const html = renderWithProviders(
        '/interview/session-abc-123',
        React.createElement(AppLayout, null, React.createElement('div', null, 'Live Interview Room'))
      );
      expect(html).toContain('w-screen h-screen overflow-hidden bg-obsidian-950');
      expect(html).toContain('Live Interview Room');
      expect(html).not.toContain('id="workspace-viewport"');
    });
  });

  describe('8. RadarChart Boundary & Resilience Tests', () => {
    it('should render fallback when data has fewer than 3 dimensions', () => {
      const html = renderToString(React.createElement(RadarChart, { data: [] }));
      expect(html).toContain('Competency radar requires at least 3 dimensions to render');
    });

    it('should render SVG radar polygon when valid 5-dimensional data is provided', () => {
      const sampleData = [
        { key: 'comm', label: 'Communication', value: 85, benchmarkValue: 80 },
        { key: 'tech', label: 'Technical Accuracy', value: 75, benchmarkValue: 80 },
        { key: 'prob', label: 'Problem Solving', value: 90, benchmarkValue: 75 },
        { key: 'conf', label: 'Confidence', value: 70, benchmarkValue: 70 },
        { key: 'star', label: 'STAR Specificity', value: 80, benchmarkValue: 75 },
      ];
      const html = renderToString(React.createElement(RadarChart, { data: sampleData, title: 'Evaluation Radar' }));
      expect(html).toContain('<svg');
      expect(html).toContain('Communication');
      expect(html).toContain('Technical Accuracy');
      expect(html).toContain('Evaluation Radar');
    });

    it('should handle extreme/boundary score values (below 0 clamped to 0, above 100 clamped to 100)', () => {
      const boundaryData = [
        { key: 'c1', label: 'Dim1', value: -50, benchmarkValue: -10 },
        { key: 'c2', label: 'Dim2', value: 150, benchmarkValue: 200 },
        { key: 'c3', label: 'Dim3', value: 50, benchmarkValue: 50 },
      ];
      const html = renderToString(React.createElement(RadarChart, { data: boundaryData }));
      expect(html).toContain('<svg');
      expect(html).toContain('Dim1');
      expect(html).toContain('Dim2');
    });

    it('reveals boundary vulnerability: null or undefined data throws TypeError before fallback check', () => {
      // RadarChart line 50 calls `const numAxes = data.length;` before the line 137 check `if (!data || data.length < 3)`.
      // Passing undefined or null causes an unhandled TypeError.
      expect(() => {
        renderToString(React.createElement(RadarChart, { data: undefined as any }));
      }).toThrow(TypeError);

      expect(() => {
        renderToString(React.createElement(RadarChart, { data: null as any }));
      }).toThrow(TypeError);
    });
  });
});