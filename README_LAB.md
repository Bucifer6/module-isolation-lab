# Quick start

Requires Node.js 22 or later. No third-party packages required.

```sh
npm run check
npm run dev
```

Open the synthetic UI at http://127.0.0.1:4300.
All records and tokens are disposable and generated for the local experiment.

The provider, consumer, widget and shell are independent processes but currently share **one repository** to demonstrate the code. This is *not* proof of cross-repository access control. Move each module into separately access-controlled repositories before running the write-denial acceptance exercise.

Lab tokens are **not appropriate for production**. The synthetic lab does not contact actual AI providers or use real personal data.

See `docs/ARCHITECTURE_LIMITATIONS.md` for unproved security and infrastructure gates.
