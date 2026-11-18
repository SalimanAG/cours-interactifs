/* Paquet de cartes : réseaux récurrents (cours 5, RNN). */
Paquets.enregistrer({
  matiere: "ai-models", id: "rnn", titre: "RNN",
  cartes: [
    { id: "pourquoi", q: "Pourquoi des modèles de séquence ?", r: "L'ordre change le sens (« Dog bites person » / « Person bites dog ») et le temps porte de l'information (valeurs passées)." },
    { id: "equations", q: "Équations d'un RNN vanilla ?", r: "<span class='mono'>hₜ = tanh(W_xh xₜ + W_hh hₜ₋₁ + b_h)</span>, <span class='mono'>ŷₜ = g(W_hy hₜ + b_y)</span> (g : softmax ou identité)." },
    { id: "etat", q: "Que contient l'état caché ?", r: "Un vecteur de caractéristiques apprises sur le préfixe x₁…xₜ, de dimension fixe : un résumé, pas une mémoire parfaite." },
    { id: "depliage", q: "Que signifie « déplier » un RNN ?", r: "Visualiser la récurrence pas par pas ; ce n'est pas plusieurs modèles : les paramètres sont partagés à chaque pas." },
    { id: "partage", q: "Avantages et contrepartie du partage des poids dans le temps ?", r: "Moins de paramètres, séquences de longueur variable, généralisation entre positions ; mais calcul séquentiel (peu parallèle)." },
    { id: "schemas", q: "Les 4 schémas entrée / sortie et un exemple chacun ?", r: "Un → un (classifieur ordinaire) ; un → plusieurs (légende d'image) ; plusieurs → un (sentiment) ; plusieurs → plusieurs (étiquetage, traduction)." },
    { id: "exemple", q: "RNN scalaire hₜ = tanh(0,5 hₜ₋₁ + xₜ), x = 1, 0, −1 : h₁, h₂, h₃ ?", r: "0,762 ; 0,363 ; −0,674 (le cours écrit −0,797 pour h₃, c'est une erreur de calcul)." },
    { id: "perte", q: "Perte d'un RNN qui prédit à chaque pas ?", r: "<span class='mono'>L = Σₜ ℓ(ŷₜ, yₜ)</span> ; pour une classification de séquence, seulement la sortie finale." },
    { id: "bptt", q: "BPTT ?", r: "Backpropagation Through Time : on déplie la séquence, on applique la dérivation en chaîne vers les états anciens, on additionne les contributions de chaque pas (poids partagés). Ce n'est pas un optimiseur." },
    { id: "evanescent", q: "Pourquoi le gradient s'évanouit-il ou explose-t-il ?", r: "<span class='mono'>∂hₜ/∂hₖ = Π ∂hⱼ/∂hⱼ₋₁</span> : un produit de nombreux facteurs, qui tend vers 0 s'ils sont petits, explose s'ils sont grands." },
    { id: "remedes", q: "Remèdes aux problèmes de gradient ?", r: "Gradient clipping (contre l'explosion seulement), LSTM / GRU, initialisation, normalisation, BPTT tronquée." },
    { id: "lstm-gru", q: "LSTM et GRU en une phrase chacun ?", r: "LSTM : état de cellule cₜ + portes d'oubli, d'entrée, de sortie. GRU : portes de mise à jour et de remise à zéro, souvent moins de paramètres." },
    { id: "bidir", q: "RNN bidirectionnel : quand l'éviter ?", r: "En prédiction strictement temps réel : il a besoin des entrées futures (contexte droit)." },
    { id: "pytorch", q: "PyTorch : forme des entrées et état final pour nn.RNN(batch_first=True) ?", r: "(batch, pas de temps, variables) ; hidden[-1] a la forme (batch, hidden_size)." }
  ]
});
