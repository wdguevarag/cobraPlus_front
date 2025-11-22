import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  AfterContentInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-general-tab-container',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './general-tab-container.component.html',
  styleUrls: ['./general-tab-container.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class GeneralTabContainerComponent implements OnChanges, AfterContentInit {
  @Input() tabs: { title: string }[] = [];
  @Input() type: 'top' | 'bottom' = 'top';
  @Input() visibleTabIndices: number[] | null = null;
  
  @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;

  visibleTabs: { title: string }[] = [];
  visibleTemplates: TemplateRef<any>[] = [];

  activeTabIndex: number = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    // Retrasamos la actualización para que el QueryList se estabilice
    setTimeout(() => {
      this.computeVisibleValues();
      this.cdRef.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['tabs'] || changes['visibleTabIndices']) && this.templates) {
      setTimeout(() => {
        this.computeVisibleValues();
        this.cdRef.detectChanges();
      });
    }
  }

  /**
   * Calcula y almacena las pestañas y templates visibles según los inputs.
   */
  private computeVisibleValues(): void {
    this.computeVisibleTabs();
    this.computeVisibleTemplates();
  }

  private computeVisibleTabs(): void {
    if (!this.visibleTabIndices || this.visibleTabIndices.length === 0) {
      this.visibleTabs = this.tabs;
    } else {
      this.visibleTabs = this.tabs.filter((tab, index) =>
        this.visibleTabIndices!.includes(index)
      );
    }
    if (this.activeTabIndex >= this.visibleTabs.length) {
      this.activeTabIndex = 0;
    }
  }

  private computeVisibleTemplates(): void {
    const allTemplates = this.templates ? this.templates.toArray() : [];
    if (!this.visibleTabIndices || this.visibleTabIndices.length === 0) {
      this.visibleTemplates = allTemplates;
    } else {
      this.visibleTemplates = allTemplates.filter((template, index) =>
        this.visibleTabIndices!.includes(index)
      );
    }
  }

  setActiveTab(index: number): void {
    if (this.activeTabIndex === index) return;
    this.activeTabIndex = index;
  }
}
