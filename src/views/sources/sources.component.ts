// components/sources/sources.component.ts
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AdminComponent } from "@/abstracts/admin-component/admin-component";
import { BaseCrudService } from "@/abstracts/base-crud-service";
import { AdminTableComponent } from "@/abstracts/admin-component/components/admin-table/admin-table.component";
import { AdminDialogComponent } from "@/abstracts/admin-component/components/admin-dialog/admin-dialog.component";

import { Source } from "@/models/source";
import { SourceService } from "@/services/source.service";
import { LookupService } from "@/services/lookup.service";

@Component({
  selector: "app-sources",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, AdminTableComponent],
  providers: [{ provide: BaseCrudService, useExisting: SourceService }],
  templateUrl: "./sources.component.html",
})
export class SourcesComponent extends AdminComponent<Source> {
  private dialog = inject(MatDialog);
  protected sourceService = inject(SourceService);
  protected lookupService = inject(LookupService);

  constructor() {
    super();

    this.config.set({
      responseKey: "sources",
      itemsPerPage: 20,
      columns: [
        {
          key: "source",
          label: "source_value",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "sourceType",
          label: "source_type",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "select",
          filterOptions: this.lookupService.lookups.source_type,
        },
        {
          key: "nameEn",
          label: "en_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
        {
          key: "nameAr",
          label: "ar_name",
          sortable: true,
          filterable: true,
          type: "text",
          filterType: "text",
        },
      ],
    });
  }

  protected openAddDialog(): void {
    this.openDialog();
  }

  protected openEditDialog(source: Source): void {
    this.openDialog(source);
  }

  private openDialog(source?: Source): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: "800px",
      disableClose: true,
      data: {
        model: source,
        modelName: this.localService.locals().source,
        modelConstructor: Source,
        formFields: [
          {
            key: "source",
            label: this.localService.locals().source_value,
            type: "text",
            required: true,
            placeholder: this.localService.locals().source_value,
          },
          {
            key: "sourceType",
            label: this.localService.locals().source_type,
            type: "select",
            required: true,
            options: this.lookupService.lookups.source_type,
          },
          {
            key: "nameEn",
            label: this.localService.locals().en_name,
            type: "text",
            required: true,
          },
          {
            key: "nameAr",
            label: this.localService.locals().ar_name,
            type: "text",
            required: true,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
}
