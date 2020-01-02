export class ExperimentResource {
    public rkResourceInExperimentId: string;

    public resourceId: string;
    public experimentTemplateId: string;

    // Запасы: Материальные ресурсы (ед.)
    public storedResourcesCount: number;

    // Запасы: Цена материальных ресурсов (руб./ед.)
    public storedResourcePrice: number;

    // Снабжение: Цены ресурсов (руб./ед.)
    public price: number;
}