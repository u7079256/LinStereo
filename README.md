# LinStereo — Project Page

Source for the project website of **LinStereo: Linear-Complexity Global Attention
for Multi-Scale Iterative Stereo Matching** (ECCV 2026).

> Underwater stereo depth estimation with a linear-complexity global-attention
> (PALA) decoder on a frozen Depth Anything 3 backbone — zero-shot generalization
> to underwater scenes where photometric cues degrade.

This is a self-contained **static site** (plain HTML/CSS/JS, no build step) designed
to be hosted on **GitHub Pages**.

## Quick start (local preview)

```bash
# from this directory
python -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

This is a plain static site, so the simplest hosting is **Deploy from a branch**:

1. Push the contents of this folder to the `main` branch of a GitHub repo
   (e.g. `LinStereo`).
2. In the repo: **Settings → Pages → Build and deployment → Source** →
   **Deploy from a branch**, then branch **`main`** / folder **`/ (root)`**.
3. The page is served at `https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/`
   within a minute or two. The `.nojekyll` file disables Jekyll processing.

All asset paths in `index.html` are **relative**, so the site works correctly under
the `/<REPO_NAME>/` sub-path without changes.

> Prefer a GitHub Actions deploy? An example workflow is included at
> `tools/github-pages-via-actions.yml.example` — move it to
> `.github/workflows/deploy.yml` and set Pages Source to **GitHub Actions**.
> (Pushing a `.github/workflows/` file needs a token with the `workflow` scope.)

### Fill in before going public
Search `index.html` for `TODO:` — these mark links that are not live yet
(arXiv / PDF, code, video, dataset). Replace them when available.

## Structure

```
.
├── index.html              # the page
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   ├── images/             # figures (rendered from the paper PDFs) + generated assets
│   ├── videos/             # demo videos (optional)
│   └── pdfs/               # paper / supplementary PDFs (optional)
├── tools/convert_figs.py   # regenerate static/images/* from ../images/*.pdf
├── .github/workflows/deploy.yml
└── .nojekyll
```

## Regenerating figures

Web figures under `static/images/` are rendered from the paper's vector PDFs in
`../images/` using [PyMuPDF](https://pymupdf.readthedocs.io/) + Pillow:

```bash
pip install pymupdf Pillow
python tools/convert_figs.py
```

## Citation

```bibtex
@inproceedings{wang2026linstereo,
  title     = {LinStereo: Linear-Complexity Global Attention for Multi-Scale Iterative Stereo Matching},
  author    = {Wang, Yiran and Turner, Oliver and Ila, Viorela},
  booktitle = {European Conference on Computer Vision (ECCV)},
  year      = {2026}
}
```

## Acknowledgements

Page design informed by recent stereo / depth project pages (FoundationStereo,
Stereo Anywhere, DEFOM-Stereo, Depth Anything). Built as plain static files.
