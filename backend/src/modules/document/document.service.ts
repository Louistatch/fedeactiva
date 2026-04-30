import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { ModeleDocument } from './entities/modele-document.entity';
import { CommandeLigne } from '../order/entities/commande-ligne.entity';
import { Commande } from '../order/entities/commande.entity';
import { Producteur } from '../user/entities/producteur.entity';
import { Pack } from '../pack/entities/pack.entity';

interface GenerateDocsData {
  commande: Commande;
  ligne: CommandeLigne;
  producteur: Producteur;
  pack: Pack;
  culture: any;
  canton: any;
}

@Injectable()
export class DocumentService {
  private readonly uploadsDir = process.env.STORAGE_PATH || './uploads';
  private readonly generatedDir = path.join(this.uploadsDir, 'generated');

  constructor(
    @InjectRepository(ModeleDocument)
    private modeleRepo: Repository<ModeleDocument>,
    @InjectRepository(CommandeLigne)
    private ligneRepo: Repository<CommandeLigne>,
    @InjectRepository(Commande)
    private commandeRepo: Repository<Commande>,
    @InjectRepository(Producteur)
    private producteurRepo: Repository<Producteur>,
    @InjectRepository(Pack)
    private packRepo: Repository<Pack>,
  ) {
    // Ensure directories exist
    if (!fs.existsSync(this.generatedDir)) {
      fs.mkdirSync(this.generatedDir, { recursive: true });
    }
  }

  async uploadModele(
    federationId: string,
    cultureId: string,
    typeDocument: 'excel' | 'word',
    file: Express.Multer.File,
    cantonId?: number,
  ): Promise<ModeleDocument> {
    // Delete existing model for this combo
    await this.modeleRepo.delete({
      federationId,
      cultureId,
      typeDocument,
      cantonId,
    });

    const modele = this.modeleRepo.create({
      federationId,
      cultureId,
      cantonId,
      typeDocument,
      fichierNom: file.originalname,
      fichierPath: file.path,
      fichierSize: file.size,
    });

    return this.modeleRepo.save(modele);
  }

  async generateDocuments(ligneCommandeId: string): Promise<{
    excelPath: string;
    excelNom: string;
    wordPath: string;
    wordNom: string;
  }> {
    const ligne = await this.ligneRepo.findOne({
      where: { id: ligneCommandeId },
      relations: ['commande', 'commande.utilisateur', 'pack', 'pack.culture'],
    });

    if (!ligne) {
      throw new NotFoundException('Ligne de commande non trouvée');
    }

    const commande = ligne.commande as Commande;
    const producteur = commande.utilisateur as Producteur;
    const pack = ligne.pack as Pack;
    const culture = pack.culture;

    // Generate Excel
    const excelNom = `Budget_${culture.nom}_${commande.reference}_${producteur.nom}.xlsx`;
    const excelPath = path.join(this.generatedDir, excelNom);
    await this.generateExcel(excelPath, {
      commande,
      ligne,
      producteur,
      pack,
      culture,
      canton: null,
    });

    // Generate Word
    const wordNom = `Itineraire_${culture.nom}_${commande.reference}_${producteur.nom}.docx`;
    const wordPath = path.join(this.generatedDir, wordNom);
    await this.generateWord(wordPath, {
      commande,
      ligne,
      producteur,
      pack,
      culture,
      canton: null,
    });

    // Update ligne with paths
    await this.ligneRepo.update(ligneCommandeId, {
      fichierExcelGenerePath: excelPath,
      fichierExcelGenereNom: excelNom,
      fichierWordGenerePath: wordPath,
      fichierWordGenereNom: wordNom,
    });

    return {
      excelPath,
      excelNom,
      wordPath,
      wordNom,
    };
  }

  private async generateExcel(
    filePath: string,
    data: GenerateDocsData,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Budget Prévisionnel');

    // Header style
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1c4a2e' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
    };

    // Title
    sheet.mergeCells('A1:F1');
    sheet.getCell('A1').value = `BUDGET PRÉVISIONNEL - ${data.culture.nom.toUpperCase()}`;
    sheet.getCell('A1').font = { bold: true, size: 16 };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    // Info section
    sheet.getCell('A3').value = 'Producteur:';
    sheet.getCell('B3').value = `${data.producteur.prenom} ${data.producteur.nom}`;
    sheet.getCell('A4').value = 'Référence:';
    sheet.getCell('B4').value = data.commande.reference;
    sheet.getCell('A5').value = 'Date:';
    sheet.getCell('B5').value = new Date(data.commande.dateCommande).toLocaleDateString('fr-FR');
    sheet.getCell('A6').value = 'Culture:';
    sheet.getCell('B6').value = data.culture.nom;

    // Budget table
    const tableHeaders = ['Poste', 'Unité', 'Quantité', 'Prix Unit.', 'Total'];
    const headerRow = sheet.addRow(tableHeaders);
    headerRow.eachCell((cell) => {
      Object.assign(cell.style, headerStyle);
    });

    // Sample budget data
    const budgetData = [
      ['Semences', 'kg', 50, 500, 25000],
      ['Engrais NPK 15-15-15', 'kg', 200, 350, 70000],
      ['Urée', 'kg', 100, 400, 40000],
      ['Fongicide', 'L', 5, 2500, 12500],
      ['Insecticide', 'L', 3, 3500, 10500],
      ['Main-d\'œuvre', 'Jours', 30, 2000, 60000],
      ['Transport', 'Forfait', 1, 15000, 15000],
    ];

    budgetData.forEach((row) => {
      sheet.addRow(row);
    });

    // Totals
    const totalRow = sheet.addRow(['TOTAL CHARGES', '', '', '', '233000']);
    totalRow.font = { bold: true };
    totalRow.getCell(5).border = { 
      top: { style: 'thin' }, 
      bottom: { style: 'double' } 
    };

    const recetteRow = sheet.addRow(['RECETTES ESTIMÉES', '', '', '', '']);
    recetteRow.font = { bold: true, color: { argb: '1c4a2e' } };

    const venteRow = sheet.addRow(['Vente production', 'kg', 1000, 400, 400000]);
    sheet.addRow(['', '', '', 'TOTAL RECETTES', 400000]);
    sheet.addRow(['', '', '', 'MARGE NETTE', 167000]);

    // Add formulas
    sheet.getCell('E10').value = { formula: 'C10*D10' };

    await workbook.xlsx.writeFile(filePath);
  }

  private async generateWord(
    filePath: string,
    data: GenerateDocsData,
  ): Promise<void> {
    // Import docx dynamically
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel } = await import('docx');
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: `ITINÉRAIRE TECHNIQUE - ${data.culture.nom.toUpperCase()}`,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Producteur: ', bold: true }),
              new TextRun(`${data.producteur.prenom} ${data.producteur.nom}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Référence: ', bold: true }),
              new TextRun(data.commande.reference),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date(data.commande.dateCommande).toLocaleDateString('fr-FR')),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'CALENDRIER CULTURAL',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: this.getCalendarText(data.culture.nom),
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'CONSEILS TECHNIQUES',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: '- Préparer le sol 2-3 semaines avant semis',
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: '- Apporter le fumier ou compost 15 jours avant plantation',
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: '- Respecter les doses d\'engrais recommandées',
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: '- Irriguer régulièrement en matinée',
            bullet: { level: 0 },
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'INTRANTS RECOMMANDÉS',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Engrais: NPK 15-15-15 (500 kg/ha), Urée (200 kg/ha)',
          }),
          new Paragraph({
            text: 'Phytosanitaires: Fongicide системique, Insecticide pyréthrinoïde',
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);
  }

  private getCalendarText(cultureNom: string): string {
    const calendars: Record<string, string> = {
      'Tomate': `1. Préparation du sol (J-21): Labour + incorporation matière organique
2. Pépinière (J-21): Semis en caissettes, nursery ombragée
3. Repiquage (J0): Plants à 4-5 feuilles, espacement 60x40 cm
4. Fertilisation fond (J+7): 200 kg NPK / ha
5. Premier engrais de couverture (J+21): 100 kg urée / ha
6. Traitements phytosanitaires: Tous les 10-15 jours
7. Récolte (J+70-90): Cueillette progressive`,
      'Oignon': `1. Préparation du sol (J-30): Sol billonné, fines oreilles
2. Pépinière (J-45): Semis en lignes, sol enrichi
3. Repiquage (J0): Plants à 4-6 feuilles, espacement 20x10 cm
4. Fertilisation (J+15): 300 kg NPK / ha
5. Sarclage + buttage (J+30)
6. Traitement fongicide préventif (J+45)
7. Arrachage + séchage (J+120-150)`,
      'Piment': `1. Pépinière (J-30): Semis en godets, ombrage 50%
2. Repiquage (J0): Plants vigoureux, espacement 50x40 cm
3. Fertilisation (J+14): 250 kg NPK / ha
4. Binage + paillage (J+21)
5. Engrais de couverture (J+45): 100 kg urée / ha
6. Récolte (J+60-90): Rouge-vert, cueillette régulière`,
    };
    return calendars[cultureNom] || 'Calendrier en cours de préparation';
  }

  async getModeles(federationId: string, cultureId?: string): Promise<ModeleDocument[]> {
    const query = this.modeleRepo.createQueryBuilder('modele')
      .where('modele.federation_id = :federationId', { federationId })
      .andWhere('modele.actif = :actif', { actif: true });

    if (cultureId) {
      query.andWhere('modele.culture_id = :cultureId', { cultureId });
    }

    return query.getMany();
  }
}