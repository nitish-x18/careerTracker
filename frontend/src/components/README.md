# Frontend Component Conventions

## Folder Structure

- `components/layout/` → Sidebar, Topbar, MainLayout
- `components/ui/` → Reusable UI components
- `components/forms/` → Reusable form components
- `components/tables/` → Reusable table components
- `pages/` → Page-specific components and screens

## Reusable Components

Before creating a new component, check whether an existing component can be reused.

Existing shared components:

- Button
- Card
- Input
- Form
- Table
- Modal
- Notification
- Loading

Avoid creating duplicate versions of these components.

## Styling

- Use Tailwind CSS for styling.
- Keep styling close to the component using Tailwind classes.
- Avoid unnecessary CSS files.
- Keep common UI patterns consistent across pages.

## Pages

Page-specific logic should remain inside the respective page folder.

Reusable UI should go inside `components/`.

## Routing

Protected application pages must remain behind `ProtectedRoute`.

## Authentication

Authentication logic should use the shared `services/auth.js` helper instead of directly accessing `localStorage` throughout the application.