import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ProblemOriginStory } from '../activities/workshop-1-problems_worth_solving/activity-1/ProblemOriginStory';
import { ProblemValidation } from '../activities/workshop-1-problems_worth_solving/activity-2/ProblemValidation';

const activities = [
  { name: 'ProblemOriginStory', component: ProblemOriginStory },
  { name: 'ProblemValidation', component: ProblemValidation },
  // add new activities here as they're migrated
];

describe('Activity layout smoke test', () => {
  activities.forEach(({ name, component: Activity }) => {
    test(`${name} renders exactly one sticky header`, () => {
      render(<Activity />);
      const stickyEls = document.querySelectorAll('.sticky');
      expect(stickyEls.length).toBe(1);
    });
  });
});