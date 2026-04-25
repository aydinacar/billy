### 1. Week -- FOUNDATION

- [x] Create a new nextjs app
- [x] Setup DB (PostgreSQL with Neon) + Drizzle ORM
- [x] Schema design for users, clients, invoices,payments
- [x] Clerk auth setup
- [x] Main Layout (Sidebar + Header, Dark Mode)
- [x] Deploy to Vercel (empty dashboard with auth check)

### 2. Week -- CLIENT MANAGEMENT

- [x] Client List Page (CRUD)
- [x] Form Validation with Zod
- [x] Table with Sorting and Pagination (tanstack table)
- [x] Client Detail Page (with invoices list)
- [x] Deliverable: Client Management MVP

### 3. Week -- INVOICE CORE

- [x] Invoice List Page (CRUD)
- [x] Invoice Form with Line Items (dynamic fields)
- [x] Invoice Detail Page (with client info and payments)
- [x] Invoice Status (Draft, Sent, Paid)
- [x] Multiple Currencies Support
- [x] Invoice Number Generation
- [x] Deliverable: Invoice Management MVP

### 4. Week -- PDF EXPORT

- [x] React PDF or Puppeteer for PDF generation
- [x] Design a professional invoice template
- [x] Download PDF from Invoice Detail Page
- [x] Deliverable: PDF Export Feature

### 5. Week -- PAYMENT INTEGRATION

- [x] Integrate Stripe for payment processing
- [x] Partial Payments Support
- [x] Calculate Overdue Invoices
- [ ] Business profile settings page (name, email, address, tax number — used on PDF and public pay page)
- [ ] Public client payment page (`/pay/[token]`, no auth required)
- [ ] Replace dashboard "Pay with Stripe" with "Copy pay link" + "View as customer"
- [x] Deliverable: Payment Integration

### 6. Week -- REVENUE DASHBOARD

- [ ] Revenue Dashboard with Charts (Revenue, Pending, Overdue)
- [ ] Last 12 Months Revenue Trends Chart
- [ ] Latest Invoices Table (with status)
- [ ] Most Valuable Clients List (by revenue)
- [ ] Empty State for Dashboard (no data)
- [ ] Deliverable: Revenue Dashboard

### 7. Week -- POLISHING

- [ ] Control All Pages Error, Loading, Empty States
- [ ] Responsive Design Improvements
- [ ] Accessibility Enhancements (e.g., keyboard navigation, ARIA labels)
- [ ] Toast Notifications for Actions (e.g., invoice created, payment received)
- [ ] Authorization audit (verify users can only access their own data)
- [ ] Critical path E2E tests (invoice create → pay → mark paid)
- [ ] Money math unit tests (`recordPaymentAndSettle`, `syncInvoiceStatus`)
- [ ] Lighthouse Performance Optimization %95+
- [ ] SEO Optimization (meta tags, sitemap, robots.txt) OG Images for social sharing
- [ ] Deliverable: Production Quality Polish

### 8. Week -- DEPLOYMENT & DOCUMENTATION

- [ ] README.md with project overview, setup instructions, and usage guide
- [ ] "Future Improvements" section in README (intentional scope cuts + next steps)
- [ ] Case Study Write-up (challenges faced, solutions implemented, future improvements)
- [ ] Demo Video Creation (walkthrough of features and functionality)
- [ ] Seed Data Script for easy testing
- [ ] Add Portfolio Website and Share
- [ ] Deliverable: Share Project with Documentation and Demo in Portfolio

---

### Future Improvements (out of 8-week scope)

Items intentionally cut from scope to keep the project shippable. Document these in the case study to demonstrate scope discipline.

- Email invoices to clients on send (Resend / Postmark integration)
- Recurring / subscription invoices
- Multi-currency exchange rate snapshotting at invoice creation
- Refund handling via Stripe (`charge.refunded` webhook)
- Audit log for invoice/payment changes
- Team accounts (multiple users per business)
