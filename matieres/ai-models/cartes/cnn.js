/* Paquet de cartes : réseaux convolutifs (cours CNN et étude de cas CIFAR-10). */
Paquets.enregistrer({
  matiere: "ai-models", id: "cnn", titre: "CNN",
  cartes: [
    { id: "tenseur", q: "Une image RGB comme tenseur ? Formats en lot ?", r: "X ∈ ℝ^(H×W×C), C = 3 ; en lot NCHW ou NHWC." },
    { id: "biais-inductif", q: "Le biais inductif d'un CNN ?", r: "Localité (chaque unité dépend d'une région limitée), partage des poids (le filtre est translaté), composition hiérarchique, équivariance par translation." },
    { id: "conv-def", q: "Convolution 2D (forme des frameworks) ?", r: "<span class='mono'>Y_ij = b + Σᵤᵥ K_uv X_i+u,j+v</span> : en fait une corrélation croisée ; la vraie convolution retourne le noyau (X_i−u,j−v)." },
    { id: "correl-ok", q: "Pourquoi utiliser la corrélation croisée n'est pas un problème ?", r: "Les noyaux sont appris : le retournement est absorbé par les paramètres." },
    { id: "taille-sortie", q: "Taille de sortie d'une convolution ?", r: "<span class='mono'>n_out = ⌊(n_in + 2p − d(k − 1) − 1)/s⌋ + 1</span> (k noyau, s stride, p padding, d dilatation)." },
    { id: "same-valid", q: "Padding « valid » et « same » ?", r: "Valid : p = 0, la carte rétrécit. Same : avec s = 1, padding choisi pour garder H′ = H, W′ = W (k = 3 → p = 1)." },
    { id: "stride", q: "Effets d'un stride s > 1 ?", r: "Moins de positions et de FLOPs, champ récepteur qui grandit plus vite, perte de détail spatial ; il change surtout l'échantillonnage." },
    { id: "equivariance", q: "Équivariance ou invariance par translation ?", r: "Équivariance : f(T_δX) ≈ T_δ f(X) (la caractéristique se déplace avec le motif). Invariance : f(T_δX) = f(X). La convolution favorise l'équivariance locale." },
    { id: "champ-recepteur", q: "Récurrence du champ récepteur ?", r: "<span class='mono'>r_l = r_(l−1) + (k_l − 1) j_(l−1)</span>, <span class='mono'>j_l = j_(l−1) s_l</span>, r₀ = j₀ = 1. Trois 3×3 de stride 1 : 3, 5, 7." },
    { id: "pooling", q: "Max / average pooling ?", r: "Max ou moyenne sur une fenêtre, par canal, sans paramètre appris ; réduit H, W et tolère de petites translations. Pas synonyme de stride (fixe vs appris)." },
    { id: "relu", q: "Pourquoi une non-linéarité (ReLU) ?", r: "Sans elle, W₃(W₂(W₁x)) = (W₃W₂W₁)x : la profondeur n'ajoute rien. <span class='mono'>ReLU(z) = max(0, z)</span>." },
    { id: "params", q: "Paramètres d'une couche de convolution ?", r: "<span class='mono'>C_out(C_in k_h k_w + 1)</span>, indépendant de H, W. Ex. 3 → 64 canaux, 3×3 : 1 792." },
    { id: "rgb-27", q: "Combien de poids a un filtre 3×3 sur une image RGB ?", r: "3 · 3 · 3 = 27 (plus un biais), pas 9." },
    { id: "flops", q: "FLOPs d'une convolution ?", r: "<span class='mono'>≈ 2 H′W′ C_out C_in k_h k_w</span> ; croît avec la résolution, les canaux et l'aire du noyau." },
    { id: "gap", q: "Global Average Pooling ?", r: "<span class='mono'>z_c = (1/HW) Σ X_ijc</span> : H×W×C → C. Bien moins de paramètres que Flatten + Dense, mais résumé spatial fort." },
    { id: "trois-trois", q: "Pourquoi empiler des 3×3 plutôt qu'un 5×5 ?", r: "Même champ récepteur (5), deux non-linéarités, 18 poids au lieu de 25 (par canal)." },
    { id: "separable", q: "Convolution séparable en profondeur : coût ?", r: "<span class='mono'>HW C_in k² + HW C_in C_out</span> au lieu de <span class='mono'>HW C_in C_out k²</span> (MobileNet)." },
    { id: "resnet-bn", q: "Bloc résiduel et BatchNorm ?", r: "ResNet : <span class='mono'>y = F(x, θ) + x</span>, chemin direct pour le signal et le gradient. Bloc courant : Conv → BN → ReLU, BN normalise par canal avec γ, β appris." },
    { id: "grad-partage", q: "Gradient d'un poids de convolution ?", r: "Somme des contributions de toutes les positions où il est réutilisé : <span class='mono'>∂L/∂W = Σᵢⱼ ∂L/∂Y_ij · ∂Y_ij/∂W</span>." },
    { id: "cifar", q: "Le CNN CIFAR-10 du cours : formes et paramètres ?", r: "32×32×3 → 30×30×32 → 15×15×32 → 13×13×64 → 6×6×64 → 4×4×64 → 1024 → 64 → 10 ; 122 570 paramètres ; ≈ 72 % en test." },
    { id: "cnn-vit", q: "CNN ou Vision Transformer ?", r: "CNN : biais local fort, interactions globales progressives, bonne efficacité en données. ViT : biais plus faible, attention globale, dépend du pré-entraînement, coût de l'attention." }
  ]
});
