**student-budget-app**

***

# 🎓 SmartSpend – Student Budgeting App

SmartSpend helps students track their expenses, manage their allowance, and develop healthy financial habits.

## 🚀 Features
- Expense tracking by category
- Visual budget insights
- Goal setting and savings tracker
- Firebase authentication
- Cross-platform (Web + Mobile)

## 🛠️ Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Firebase
- **Styling:** Tailwind CSS

## 💡 Branching Strategy
| Branch | Purpose |
|--------|----------|
| `main` | Production-ready code only |
| `dev` | Main development branch |
| `login` | Handles authentication pages |
| `dashboard` | Student dashboard features |
| `expenses` | Expense tracking logic |

> ⚠️ Don’t push directly to `main`. Work on your feature branch and open a PR to `dev`.

## 🧑‍💻 Getting Started
```bash
git clone https://github.com/nyeliep/smart-spend-app.git
cd student-budget-app
npm install
npm run dev

---

### 🌿 4. Push to branches
```bash
git checkout dev
git push origin dev

git checkout login
git push origin login

git checkout register
git push origin register

git checkout dashboard
git push origin dashboard

git checkout add-expenses
git push origin expenses

git checkout report
git push origin report
