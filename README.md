# 🧠 Second Brain

> A minimal, extensible platform for capturing thoughts, ideas, links, notes, and anything else you don’t want to forget.

**Second Brain** is a personal knowledge capture app — built for devs, thinkers, and creators — to store fleeting ideas, important content, or useful resources for later. It's like your personal digital memory bank.

---

## 📁 Project Structure

```
client/
    └── .gitkeep
server/
    ├── src/
        ├── controllers/
            ├── admin.controller.ts
            ├── content.controller.ts
            ├── link.controller.ts
            ├── tags.controller.ts
            └── user.controller.ts
        ├── middlewares/
            ├── adminAuth.middleware.ts
            ├── errorHandler.middleware.ts
            └── userAuth.middleware.ts
        ├── models/
            ├── content.model.ts
            ├── db.ts
            ├── link.model.ts
            ├── tags.model.ts
            └── user.model.ts
        ├── routers/
            ├── admin.router.ts
            ├── content.router.ts
            ├── link.router.ts
            ├── tags.router.ts
            └── user.router.ts
        ├── schemas/
            ├── content.zod.ts
            ├── tag.zod.ts
            └── user.zod.ts
        ├── types/
            └── types.ts
        ├── utils/
            ├── ApiError.util.ts
            ├── ApiResponse.util.ts
            └── asyncHandler.util.ts
        ├── constants.ts
        └── index.ts
    ├── package.json
    ├── pnpm-lock.yaml
    └── tsconfig.json
.gitignore
docker-compose.yml
```