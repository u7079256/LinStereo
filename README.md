# <img src="static/favicon.svg" alt="logo" width="28"/> LinStereo: Linear-Complexity Global Attention for Multi-Scale Iterative Stereo Matching

> *"The whole is more than the sum of its parts." --- Aristotle*

![teaser](static/images/og_card.jpg)

> **LinStereo: Linear-Complexity Global Attention for Multi-Scale Iterative Stereo Matching**
>
> [Yiran Wang](https://u7079256.github.io/LinStereo/)<sup>1</sup>, [Oliver Turner](https://u7079256.github.io/LinStereo/)<sup>1</sup>, [Viorela Ila](https://u7079256.github.io/LinStereo/)<sup>1‡</sup>
>
> <sup>1</sup>Australian Centre for Robotics, The University of Sydney
>
> <sup>‡</sup>Corresponding author.
>
> ### [🌐 Website](https://u7079256.github.io/LinStereo/) | [📄 Paper (soon)](#) | [🌊 SeaStereo Dataset (soon)](#) | [📌 BibTeX](#-citation)

> **TL;DR** — LinStereo redesigns the iterative stereo update loop around **Position-Aware Linear Attention (PALA)**, a global *O(N)* operator on a **frozen Depth Anything V3** backbone, so reliable disparity propagates across the whole image in a single step. It is competitive on standard benchmarks and generalizes **zero-shot** to new domains, including underwater. **Accepted to ECCV 2026.**

> [!NOTE]
> 🚧 **Code, weights, and the SeaStereo dataset are not released yet — they are coming to this repo soon.** Star ⭐ / watch 👀 to be notified.

---

## ✏️ Citation

If you find our work helpful, please consider starring ⭐ this repo and citing:

```bibtex
@inproceedings{wang2026linstereo,
  title={LinStereo: Linear-Complexity Global Attention for Multi-Scale Iterative Stereo Matching},
  author={Wang, Yiran and Turner, Oliver and Ila, Viorela},
  booktitle={European Conference on Computer Vision (ECCV)},
  year={2026}
}
```

---

## 🏃 Intro

**LinStereo** is a **general** deep stereo-matching method. Iterative stereo updaters rely on *local* operators (ConvGRUs), so reliable matches diffuse only a few pixels per step and struggle wherever local photometric cues collapse — textureless, non-Lambertian, or light-scattering (underwater) scenes. LinStereo replaces the local updater with a **global, linear-complexity** one and reads geometry priors from a frozen monocular foundation model.

**Key components:**

- 🧭 **Position-Aware Linear Attention (PALA)** — a global attention update operator with **O(N)** complexity in the number of pixels. Reliable disparity propagates across the *whole* image in a single step, at roughly the per-iteration cost of a local ConvGRU.
- 🧱 **Hierarchical Semantic Cost Volume (HSCV)** — multi-scale cost construction guided by foundation-model semantics.
- 🎯 **Depth Prior Initialization (DPI)** — initializes the iterative loop from the backbone's monocular depth prior for faster, more stable convergence.
- ❄️ **Frozen Depth Anything V3 backbone** (DINOv2 ViT-B/14 + Dual-DPT head) — no backbone fine-tuning; trained on **SceneFlow only**.
- 🌍 **Zero-shot generalization** — strong on standard benchmarks *and* unseen domains (real-world & synthetic underwater) with **no** domain-specific data.

![architecture](static/images/architecture.png)

---

## ⚡ Quick Start

> 🚧 **Code release is coming soon.** The snippet below shows the *intended* API and will be updated when the code lands in this repo.

```python
# (planned API — not yet available)
import torch
from linstereo import LinStereo

model = LinStereo.from_pretrained("u7079256/LinStereo").eval().cuda()

left  = load_image("left.png")    # (B, 3, H, W)
right = load_image("right.png")
disparity = model(left, right, iters=8)   # (B, 1, H, W)
```

---

## ⚖️ Weights

> 🚧 Pretrained weights will be released here.

| Model | Backbone | Training data | Link |
|---|---|---|---|
| **LinStereo** | Depth Anything V3 · ViT-B/14 (frozen) | SceneFlow only | 🚧 Coming soon |

---

## 📦 Datasets

We release **SeaStereo**, a physically-rendered underwater stereo corpus with dense disparity ground truth, and evaluate **zero-shot** on standard + underwater benchmarks.

| Dataset | Role | Notes |
|---|---|---|
| **SeaStereo** (ours) | underwater · synthetic | ~40K stereo pairs · 7 Jerlov water types · 1000+ configs · dense GT · 🚧 download soon |
| KITTI 2012 / 2015 | standard | driving |
| Middlebury (H) | standard | indoor, high-res |
| ETH3D | standard | indoor/outdoor, low-texture |
| Booster (Q) | standard | non-Lambertian (glass, metal) |
| TartanAir-UW | underwater · synthetic | long-range backscatter |
| SQUID | underwater · real-world | near-field attenuation |

> **SeaStereo** rendering pipeline: ShapeNetCore foreground objects composited over real marine backgrounds (coral, fish, shipwrecks) and rendered in Blender under varying Jerlov water types.

---

## 📐 PALA vs. ConvGRU

PALA is a **global** update operator, yet its **per-iteration** latency is on par with the **local** ConvGRUs it replaces (480×640, single NVIDIA RTX 4500):

| Update operator | Latency (ms) ↓ |
|---|---|
| **PALA (Ours)** | **3.50 ± 0.05** |
| RAFT-Stereo ConvGRU | 3.63 ± 0.06 |
| IGEV ConvGRU | 3.43 ± 0.03 |

LinStereo is a large, **accuracy-first** model (frozen Depth Anything V3 backbone) rather than a lightweight real-time network — see the [website](https://u7079256.github.io/LinStereo/#efficiency) for the full efficiency table.

---

## 🧪 Zero-Shot Results

### Standard benchmarks — EPE (SceneFlow-only)

| Method | KITTI'15 | KITTI'12 | Midd(H) Occ | ETH3D | Booster(Q) |
|---|---|---|---|---|---|
| RAFT-Stereo | 1.13 | 0.90 | 3.31 | 0.36 | 4.18 |
| MGStereo | 1.13 | 0.87 | 2.89 | 0.25 | 2.26 |
| DEFOM-Stereo · ViT-L | 1.06 | 0.84 | 2.11 | 0.35 | 3.52 |
| FoundationStereo · ViT-L (+extra) | 0.95 | 0.71 | 2.67 | 0.21 | 1.77 |
| **LinStereo (Ours · ViT-B)** | 1.01 | 0.76 | **1.33** | 0.24 | 2.14 |

> LinStereo's **1.33** occluded-EPE on Middlebury is **37% below** the previous best (DEFOM, 2.11) — direct evidence of PALA propagating reliable disparity into occluded pixels. Full table with **bold/second-best** highlighting on the [website](https://u7079256.github.io/LinStereo/#results).

### Underwater — Rel ↓ / RMSE ↓ (SceneFlow-only)

| Method | TartanAir-UW Rel | TartanAir-UW RMSE | SQUID Rel | SQUID RMSE |
|---|---|---|---|---|
| RAFT-Stereo | 0.08 | 4.36 | 0.07 | 1.25 |
| IGEV++ (+extra) | 0.09 | 4.37 | 0.06 | 1.11 |
| FoundationStereo (+extra) | 0.05 | 3.01 | 0.07 | 1.36 |
| **LinStereo (Ours)** | **0.04** | **2.08** | **0.04** | **0.90** |

> **Best on every metric** on both benchmarks — even against methods trained with real-world / domain-specific data: **9.8%** lower AbsRel and **31%** lower RMSE vs. FoundationStereo on TartanAir-UW, and **24.3%** lower AbsRel and **33%** lower Rel vs. IGEV++ on SQUID.

---

## 🚀 Real-World Deployment

A controlled laboratory water tank at close range (< 2 m), with AprilTag + CAD-model ground truth down to sub-millimetre, including ~3 mm taut ropes as a fine-structure stress test:

| Method | Rel ↓ | RMSE ↓ | A1 ↑ |
|---|---|---|---|
| RAFT-Stereo | 0.06 | 0.15 | 0.94 |
| IGEV++ (+extra) | 0.05 | 0.12 | 0.96 |
| **LinStereo (Ours)** | **0.04** | **0.07** | **0.98** |

---

## 😘 Acknowledgement

- We thank **Jay Zhang** and **Dr. Gideon Billings** for help collecting the real-world underwater data.
- LinStereo builds on a frozen **[Depth Anything V3](https://github.com/DepthAnything/Depth-Anything-V2)** backbone, and our evaluation follows recent stereo work — **[RAFT-Stereo](https://github.com/princeton-vl/RAFT-Stereo)**, **[IGEV / IGEV++](https://github.com/gangweiX/IGEV-Stereo)**, **[FoundationStereo](https://github.com/NVlabs/FoundationStereo)**, **[Stereo Anywhere](https://github.com/bartn8/stereoanywhere)**, **[DEFOM-Stereo](https://github.com/Insta360-Research-Team/DEFOM-Stereo)**.
- Project page styling informed by recent depth / stereo project pages.

---

## 📜 License

The code, pretrained weights, and **SeaStereo** dataset will be released for **non-commercial research use** (CC BY-NC-SA 4.0). Final license terms will accompany the code release.

---

<details>
<summary><b>🛠️ Project page / development</b></summary>

This repository also hosts the project **website** — a self-contained static site (plain HTML/CSS/JS, no build step) served via GitHub Pages at <https://u7079256.github.io/LinStereo/>.

```bash
# local preview
python -m http.server 8000   # then open http://localhost:8000
```

- `index.html` + `static/{css,js,images}` — the page. Asset paths are relative, so it works under the `/LinStereo/` sub-path.
- `tools/` — figure pipeline (PyMuPDF + Pillow): `slice_grids.py` (per-panel grid slicer at native resolution), `gen_gallery.py` / `gen_hero.py` (build the one-row galleries + hero pairs), `gen_tables.py` (parse the paper's `.tex` tables → HTML, verbatim), `render_supp.py`, `splice.py`.
- **Deploy:** push to `main` → GitHub Pages (**Settings → Pages → Deploy from a branch → `main` / `/ (root)`**). `.nojekyll` disables Jekyll.

</details>
